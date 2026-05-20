import { z } from 'zod';

const diagramSchema = z
  .object({
    kind: z.enum(['mermaid', 'svg']),
    source: z.string().min(1).max(8000),
    caption: z.string().max(300).optional(),
  })
  .nullable()
  .optional();

export const mathQuestionSchema = z.object({
  topic: z.string().min(1).max(200),
  questionText: z.string().min(1).max(8000),
  diagram: diagramSchema,
  stepsIntro: z.string().max(2000).optional(),
  workingSteps: z.array(z.string().max(2000)).max(20),
  finalAnswer: z.string().max(2000),
  tip: z.string().max(1000),
});

export const activeUserSchema = z.object({
  sessionId: z.string().uuid(),
  displayName: z.string().min(1).max(40),
  joinedAt: z.number().int(),
});
export type ActiveUser = z.infer<typeof activeUserSchema>;

export const renamePayloadSchema = z.object({
  sessionId: z.string().uuid(),
  displayName: z.string().min(1).max(40),
});

export const sharePayloadSchema = z.object({
  fromSessionId: z.string().uuid(),
  to: z.array(z.string().uuid()).min(1).max(50),
  question: mathQuestionSchema,
});

export const notificationSchema = z.object({
  id: z.string(),
  fromSessionId: z.string().uuid(),
  fromName: z.string(),
  question: mathQuestionSchema,
  receivedAt: z.number().int(),
});
export type RealtimeNotification = z.infer<typeof notificationSchema>;

export const serverEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('welcome'), users: z.array(activeUserSchema) }),
  z.object({ type: z.literal('users_updated'), users: z.array(activeUserSchema) }),
  z.object({ type: z.literal('shared'), notification: notificationSchema }),
  z.object({ type: z.literal('share_ack'), deliveredTo: z.array(z.string().uuid()) }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);
export type ServerEvent = z.infer<typeof serverEventSchema>;
