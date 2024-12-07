import type { Collaborators, Workspace } from './board';
import type { Profiles } from './user';

export type CollaboratorsData = Workspace & {
  collaborators: (Collaborators & { profiles: Profiles })[];
};
