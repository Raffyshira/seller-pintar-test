import MainArticleSection from "@/components/main-article-section";
import { Suspense } from "react";

import SmoothScroll from "./providers/lenis-scroll";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading scroll...</div>}>
      <SmoothScroll>
        <MainArticleSection />
      </SmoothScroll>
    </Suspense>

  )
}
