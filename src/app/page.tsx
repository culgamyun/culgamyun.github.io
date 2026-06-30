import { PortfolioPage } from "@/components/portfolio-page";
import { apps } from "@/data/apps";

export default function Home() {
  return <PortfolioPage apps={apps} />;
}
