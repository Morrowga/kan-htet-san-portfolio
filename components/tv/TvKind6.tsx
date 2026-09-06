import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 6 — asset at /public/tv/tv-kind-6.png */
export default function TvKind6(props: TvProps) {
  return <TvBase kind={6} {...props} />;
}
