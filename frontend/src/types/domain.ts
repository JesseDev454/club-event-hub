export type ClubSummary = {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string | null;
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

export type EventClubSummary = {
  id: string;
  name: string;
  category: string;
  contactEmail: string | null;
};

export type EventSummary = {
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

export type EventDetail = EventSummary;

export type EventFormInput = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: string;
};

export type EventUpdateInput = Partial<EventFormInput>;
