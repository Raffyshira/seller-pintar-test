import MainArticleSection from "@/components/main-article-section";

import SmoothScroll from "./providers/lenis-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <MainArticleSection />
    </SmoothScroll>
  )
}
