import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { ViewTab } from "@/components/ui/view-tab";
import { ViewTabBar } from "@/components/ui/view-tab-bar";

const variants = ["filled", "stroke", "lighter", "ghost"] as const;
type Variant = (typeof variants)[number];
type Color = "primary" | "secondary" | "destructive";

const hoverClassMap: Record<Color, Record<Variant, string>> = {
  primary: {
    filled: "bg-primary-dark",
    stroke: "bg-primary-lighter",
    lighter: "bg-primary-light",
    ghost: "bg-primary-lighter",
  },
  secondary: {
    filled: "bg-secondary-dark",
    stroke: "bg-secondary-lighter",
    lighter: "bg-secondary-light",
    ghost: "bg-secondary-lighter",
  },
  destructive: {
    filled: "bg-destructive-dark",
    stroke: "bg-destructive-lighter",
    lighter: "bg-destructive-light",
    ghost: "bg-destructive-lighter",
  },
};

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

function ButtonPair({
  variant,
  color,
  className,
  disabled,
}: {
  variant: Variant;
  color?: Color;
  className?: string;
  disabled?: boolean;
}) {
  const shared: Partial<ButtonProps> = { variant, color, className, disabled };
  return (
    <div className="flex items-center gap-2">
      <Button {...shared}>
        <ChevronLeft /> Button <ChevronRight />
      </Button>
      <Button {...shared} size="icon">
        <Copy />
      </Button>
    </div>
  );
}

function ButtonGrid({ color }: { color: Color }) {
  const label =
    color === "primary"
      ? "Primary"
      : color === "secondary"
        ? "Secondary"
        : "Destructive";
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium">Button &mdash; {label}</h2>

      <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] items-start gap-x-6 gap-y-4">
        <div />
        {variants.map((v) => (
          <span
            key={v}
            className="text-xs font-medium capitalize tracking-wider text-muted-foreground"
          >
            {v}
          </span>
        ))}

        <span className="self-center text-xs text-muted-foreground">
          {states[0]}
        </span>
        {variants.map((v) => (
          <ButtonPair key={v} variant={v} color={color} />
        ))}

        <span className="self-center text-xs text-muted-foreground">
          {states[1]}
        </span>
        {variants.map((v) => (
          <ButtonPair
            key={v}
            variant={v}
            color={color}
            className={hoverClassMap[color][v]}
          />
        ))}

        <span className="self-center text-xs text-muted-foreground">
          {states[2]}
        </span>
        {variants.map((v) => (
          <ButtonPair
            key={v}
            variant={v}
            color={color}
            className="ring-2 ring-primary-light ring-offset-2"
          />
        ))}

        <span className="self-center text-xs text-muted-foreground">
          {states[3]}
        </span>
        {variants.map((v) => (
          <ButtonPair key={v} variant={v} color={color} disabled />
        ))}
      </div>
    </section>
  );
}

const viewTabBarTabs = [
  { label: "All", count: 150 },
  { label: "Health at risk", count: 22 },
  { label: "Low engagement patients", count: 76 },
  { label: "Elderly patients", count: 43 },
  { label: "New patients", count: 12 },
  { label: "Early stage patients", count: 27 },
  { label: "Chronic conditions", count: 34 },
  { label: "Medication review", count: 18 },
  { label: "Follow-up required", count: 9 },
];

function ViewTabBarDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ViewTabBar
      tabs={viewTabBarTabs}
      activeIndex={activeIndex}
      onTabChange={setActiveIndex}
    />
  );
}

export default function ComponentShowcase() {
  return (
    <main className="min-h-screen bg-background px-8 py-12 text-foreground">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Component Showcase
          </h1>
          <Link
            to="/"
            className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            Back to app
          </Link>
        </header>

        <ButtonGrid color="primary" />
        <ButtonGrid color="secondary" />
        <ButtonGrid color="destructive" />

        <section className="space-y-6">
          <h2 className="text-lg font-medium">Input Field</h2>

          <div className="grid max-w-sm gap-8">
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Default</span>
              <InputField
                label="Change Label"
                required
                optional
                placeholder="Placeholder text..."
                hint="This is a hint text to help user."
              />
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Hover</span>
              <InputField
                label="Change Label"
                required
                optional
                placeholder="Placeholder text..."
                hint="This is a hint text to help user."
                className="[&>div:nth-child(2)]:border-stroke-sub"
              />
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Focus</span>
              <InputField
                label="Change Label"
                required
                optional
                placeholder="Placeholder text..."
                hint="This is a hint text to help user."
                className="[&>div:nth-child(2)]:border-2 [&>div:nth-child(2)]:border-stroke-strong [&>div:nth-child(2)]:px-[11px] [&>div:nth-child(2)]:py-[9px]"
              />
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Selected (filled)</span>
              <InputField
                label="Change Label"
                required
                optional
                defaultValue="Placeholder text..."
                hint="This is a hint text to help user."
              />
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Disabled</span>
              <InputField
                label="Change Label"
                required
                optional
                placeholder="Placeholder text..."
                hint="This is a hint text to help user."
                disabled
              />
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">Destructive</span>
              <InputField
                label="Change Label"
                required
                optional
                variant="destructive"
                placeholder="Placeholder text..."
                hint="This is a hint text to help user."
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-medium">View Tab Bar</h2>
          <ViewTabBarDemo />
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-medium">View Tab</h2>

          <div className="grid grid-cols-[100px_1fr] items-center gap-x-6 gap-y-4">
            <span className="text-xs text-muted-foreground">Unselected</span>
            <div className="flex gap-3">
              <ViewTab count={12}>View tab</ViewTab>
              <ViewTab>No count</ViewTab>
            </div>

            <span className="text-xs text-muted-foreground">Hover</span>
            <div className="flex gap-3">
              <ViewTab count={12} className="bg-(--alpha-neutral-10)">
                View tab
              </ViewTab>
            </div>

            <span className="text-xs text-muted-foreground">Selected</span>
            <div className="flex gap-3">
              <ViewTab selected count={12}>View tab</ViewTab>
              <ViewTab selected>No count</ViewTab>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
