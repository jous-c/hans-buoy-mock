import * as React from "react";
import { SlidersHorizontal, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ViewTab } from "@/components/ui/view-tab";

type ViewTabItem = {
  label: string;
  count?: number | string;
};

type ViewTabBarProps = React.ComponentProps<"div"> & {
  tabs: ViewTabItem[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  onSettingsClick?: () => void;
  onAddClick?: () => void;
};

function ViewTabBar({
  className,
  tabs,
  activeIndex = 0,
  onTabChange,
  onSettingsClick,
  onAddClick,
  ...props
}: ViewTabBarProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeTab = container.children[activeIndex] as HTMLElement | undefined;
    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="stroke"
          color="secondary"
          size="compact"
          onClick={onSettingsClick}
          aria-label="Settings"
        >
          <SlidersHorizontal />
        </Button>
        <div className="h-[35px] w-px bg-stroke" />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          ref={scrollRef}
          className="flex-1 min-w-0 overflow-x-auto scrollbar-hide"
        >
          <div className="flex w-max items-center gap-2">
            {tabs.map((tab, index) => (
              <ViewTab
                key={index}
                selected={index === activeIndex}
                count={tab.count}
                onClick={() => onTabChange?.(index)}
              >
                {tab.label}
              </ViewTab>
            ))}
          </div>
        </div>

        <Button
          variant="stroke"
          color="secondary"
          size="compact"
          onClick={onAddClick}
          aria-label="Add view"
          className="shrink-0"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export { ViewTabBar };
export type { ViewTabBarProps, ViewTabItem };
