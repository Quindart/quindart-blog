"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_wxRtpBRbvFemzZwD8dcZSmpKQe223gB2N4mpu4Ngoqis";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export default function PostHogProvider() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: "2026-05-30",
    });
  }, []);

  return null;
}
