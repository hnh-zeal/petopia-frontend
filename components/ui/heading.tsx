interface HeadingProps {
    title: string;
  }
  
  export const Heading: React.FC<HeadingProps> = ({ title }) => {
    return (
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {/* <p className="text-sm text-muted-foreground">{description}</p> */}
      </div>
    );
  };