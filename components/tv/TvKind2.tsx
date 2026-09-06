import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 2 — asset at /public/tv/tv-kind-2.png */
export default function TvKind2(props: TvProps) {
  return <TvBase kind={2} {...props} />;
}
