import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 4 — asset at /public/tv/tv-kind-4.png */
export default function TvKind4(props: TvProps) {
  return <TvBase kind={4} {...props} />;
}
