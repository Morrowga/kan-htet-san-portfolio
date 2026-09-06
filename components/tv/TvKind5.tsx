import TvBase from "./TvBase";
import type { TvProps } from "./types";

/** Television frame kind 5 — asset at /public/tv/tv-kind-5.png */
export default function TvKind5(props: TvProps) {
  return <TvBase kind={5} {...props} />;
}
