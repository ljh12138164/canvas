import { Link } from "react-router-dom";

interface RouterProps {
  to: string;
  children: React.ReactNode;
}
const Router = ({ to, children }: RouterProps) => {
  return <Link to={to}>{children}</Link>;
};

export default Router;
