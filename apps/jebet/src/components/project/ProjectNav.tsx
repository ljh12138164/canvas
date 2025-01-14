import { FiEdit3 } from "react-icons/fi";
import { Project } from "@/types/workspace";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "@/components/ui/button";

const ProjectNavContainer = styled.nav`
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`;
const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ProjectItemIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;
const ProjectItemName = styled.span`
  font-size: 16px;
  font-weight: 600;
`;
const EditText = styled(Button)`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;
export default function ProjectNav({ project }: { project: Project }) {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  return (
    <ProjectNavContainer>
      <ProjectItem>
        <ProjectItemIcon src={project.imageUrl} alt={project.name} />
        <ProjectItemName>{project.name}</ProjectItemName>
      </ProjectItem>

      <EditText
        variant="outline"
        onClick={() =>
          navigate(`/dashboard/${workspaceId}/${project.id}/setting`)
        }
      >
        <FiEdit3 />
        <span>编辑</span>
      </EditText>
    </ProjectNavContainer>
  );
}
