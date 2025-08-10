import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

type CreateMeetLinkParams = {
  summary: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendees?: { email: string }[];
  recurrenceRule?: string; // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO"
};

export async function createMeetLink({
  summary,
  description,
  startTime,
  endTime,
  attendees = [],
  recurrenceRule,
}: CreateMeetLinkParams): Promise<{ meetLink: string; eventId: string }> {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: process.env.GOOGLE_CALENDAR_ADMIN_EMAIL, // Impersonated admin
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const requestBody: any = {
    summary,
    description,
    start: {
      dateTime: startTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime,
      timeZone: 'UTC',
    },
    attendees,
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  
  if (recurrenceRule) {
    requestBody.recurrence = [recurrenceRule]; // e.g., ["RRULE:FREQ=WEEKLY;BYDAY=MO"]
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody,
    conferenceDataVersion: 1,
  });

  return {
    meetLink: response.data.hangoutLink!,
    eventId: response.data.id!,
  };
}
