"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/actions/auth";
import { ConfigurationErrorBanner } from "@/components/ConfigurationErrorBanner";
import { PostLostAlert } from "@/components/PostLostAlert";
import { ReportFoundItem } from "@/components/ReportFoundItem";
import { profileHandle } from "@/lib/display-username";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function usernameForHeader(user: User, profileUsername: string | null | undefined) {
  const fromProfile = profileHandle(profileUsername ?? null);
  if (fromProfile) {
    return fromProfile;
  }
  const meta = user.user_metadata?.username;
  return profileHandle(typeof meta === "string" ? meta : null);
}

export function HeaderUserSection() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setConfigError(true);
      setReady(true);
      return;
    }

    const client = supabase;

    async function load() {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        setAuthenticated(false);
        setUsername(null);
        setReady(true);
        return;
      }

      setAuthenticated(true);

      let { data: row } = await client
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (!row?.username) {
        for (let i = 0; i < 3; i++) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          ({ data: row } = await client
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle());
          if (row?.username) break;
        }
      }

      setUsername(usernameForHeader(user, row?.username));
      setReady(true);
    }

    load();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(() => {
      load();
    });

    return () => subscription.unsubscribe();
  }, []);

  const showPost =
    username &&
    (pathname === "/" || pathname === "/lost-alerts");

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {!ready ? (
        <span className="text-xs text-spot-blue/50" aria-hidden>
          …
        </span>
      ) : configError ? (
        <div className="max-w-[min(100%,20rem)]">
          <ConfigurationErrorBanner />
        </div>
      ) : authenticated ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {username ? (
            <span className="text-sm text-spot-blue">
              <span className="text-spot-blue/70">Username</span>{" "}
              <span className="font-semibold text-spot-navy">{username}</span>
            </span>
          ) : (
            <span className="text-sm text-spot-blue/70">Loading profile…</span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-medium text-spot-navy ring-1 ring-spot-sky/60 hover:bg-spot-sky/40"
            >
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-spot-blue hover:bg-spot-sky/40"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-spot-coral px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-spot-coral-hover"
          >
            Sign up
          </Link>
        </div>
      )}
      {showPost && pathname === "/" && <ReportFoundItem />}
      {showPost && pathname === "/lost-alerts" && <PostLostAlert />}
    </div>
  );
}
