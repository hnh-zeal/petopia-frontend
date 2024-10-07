interface HeadingProps {
  title: string;
}

import { motion } from "framer-motion";

export const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {/* <p className="text-sm text-muted-foreground">{description}</p> */}
    </motion.div>
  );
};
