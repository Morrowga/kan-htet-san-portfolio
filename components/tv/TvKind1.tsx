import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 1 — asset at /public/tv/tv-kind-1.png */
export default function TvKind1(props: TvProps) {
  return <TvBase kind={1} {...props} />;
}
