import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 3 — asset at /public/tv/tv-kind-3.png */
export default function TvKind3(props: TvProps) {
  return <TvBase kind={3} {...props} />;
}
