// Props TYPE
type TabPanelProps = {
  children?: JSX.Element;
  index: number;
  value: number;
  className?: string;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, className, ...other } = props;

  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
