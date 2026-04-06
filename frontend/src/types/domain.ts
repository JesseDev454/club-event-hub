export type ClubSummary = {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string | null;
  tagline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClubEventSummary = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type ClubDetail = ClubSummary & {
  upcomingEvents: ClubEventSummary[];
};

export type ClubFormValues = {
  name: string;
  description: string;
  category: string;
  contactEmail: string;
  tagline: string;
};

export type ClubCreateInput = {
  name: string;
  description: string;
  category: string;
  contactEmail: string | null;
  tagline: string | null;
};

export type ClubUpdateInput = Partial<ClubCreateInput> & {
  tagline?: string | null;
};

export type EventClubSummary = {
  id: string;
  name: string;
  category: string;
  contactEmail: string | null;
};

export type EventListItem = {
  id: string;
  clubId: string;
  createdBy: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  club: EventClubSummary;
};

export type EventRichFields = {
  highlights: string[];
  targetAudience: string[];
  additionalInfo: string | null;
};

export type ManagedEvent = EventListItem & EventRichFields;

export type EventDetail = ManagedEvent & {
  rsvpCount: number;
  hasRsvped: boolean | null;
};

export type RsvpActionResponse = {
  eventId: string;
  rsvpCount: number;
  hasRsvped: boolean;
};

export type EventFormValues = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: string;
  highlightsText: string;
  targetAudienceText: string;
  additionalInfo: string;
};

export type EventCreateInput = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  venue: string;
  category: string;
  highlights: string[];
  targetAudience: string[];
  additionalInfo?: string | null;
};

export type EventUpdateInput = Partial<Omit<EventCreateInput, "endTime" | "additionalInfo">> & {
  endTime?: string | null;
  additionalInfo?: string | null;
};
