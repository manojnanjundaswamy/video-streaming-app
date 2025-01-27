import { ArrowLeft, Bell, Menu, Mic, Search, Upload, User } from "lucide-react";
import Logo from "../assets/VideoStreamingLogo.gif";
import { Button } from "../components/Button";
import { useContext, useState } from "react";
import { useSidebarContext } from "../contexts/SidebarContext";
import { VisibilityContextUpload } from "../contexts/VisibilityContextUpload";

interface PageHeaderProps {
  onClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onClick }) => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);

  return (
    <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 ml-4 mx-12">
      <PageHeaderFirstSection hidden={showFullWidthSearch} />
      <form
        className={`gap-4 flex-grow justify-center ${
          showFullWidthSearch ? "flex" : "hidden md:flex"
        }`}
      >
        {showFullWidthSearch && (
          <Button
            onClick={() => setShowFullWidthSearch(false)}
            type="button"
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="flex flex-grow max-w-[600px]">
          <input
            type="search"
            placeholder="Search"
            className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-lg w-full focus:border-blue-500 outline-none"
          />
          <Button
            variant="ghost"
            className="dark:bg-black-100 dark:hover:bg-gray-700 dark:text-white py-2 px-4 rounded-r-full border-secondary-border border border-l-0 flex-shrink-0"
          >
            <Search />
          </Button>
        </div>
      </form>
      <div>
        <Button
          size="icon"
          variant="ghost"
          className="dark:text-white mr-5"
          onClick={onClick}
        >
          <Upload name=" Upload New Video" />
        </Button>
      </div>
    </div>
  );
};

type PageHeaderFirstSectionProps = {
  hidden?: boolean;
};

export function PageHeaderFirstSection({
  hidden = false,
}: PageHeaderFirstSectionProps) {
  const { toggle } = useSidebarContext();

  return (
    <div
    >
      <a href="/">
        <img src={Logo} className="h-12 w-36" />
      </a>
    </div>
  );
}
