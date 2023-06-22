import { motion } from "framer-motion";

const Path = ({ ...props }) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    strokeLinecap="round"
    transition={{ duration: 0.15 }}
    {...props}
  />
);

type MenuToggleProps = {
  className: string;
};

const MenuToggle = ({ className }: MenuToggleProps) => (
  <svg width={20} height={20} className={className} viewBox="0 0 40 40">
    <Path
      variants={{
        closed: { d: "M 2 2.5 L 20 2.5" },
        open: { d: "M 3 16.5 L 17 2.5" },
      }}
    />
    <Path
      d="M 2 9.423 L 20 9.423"
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 },
      }}
    />
    <Path
      variants={{
        closed: { d: "M 2 16.346 L 20 16.346" },
        open: { d: "M 3 2.5 L 17 16.346" },
      }}
    />
  </svg>
);

export default MenuToggle;
