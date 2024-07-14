import {FastifyInstance} from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {z} from "zod";

import {prisma} from "../lib/prisma";
import {dayjs} from "../lib/dayjs";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {getMailClient} from "../lib/mail";
import nodemailer from "nodemailer";

async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/trips/:tripId/confirm", {
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
      })
    }
  }, async (request, reply) => {
    const {tripId} = request.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: {
          where: {
            is_owner: false,
          }
        }
      }
    });

    if (!trip) {
      throw new Error("Trip does not exist");
    }

    if (trip.is_confirmed) {
      return reply.redirect(`http://localhost:8000/trips/${tripId}`);
    }

    await prisma.trip.update({
      where: {id: tripId},
      data: {is_confirmed: true},
    });

    const formattedDateAtTrip = {
      start: dayjs(trip.starts_at).format("LL"),
      end: dayjs(trip.ends_at).format("LL")
    }

    const mail: Mail<SMTPTransport.SentMessageInfo> = await getMailClient();

    await Promise.all(
      trip.participants.map(async ( participant ) => {
        const confirmationLink = `http://localhost:8000/participants/${participant.id}/confirm`;

        const message: SMTPTransport.SentMessageInfo = await mail.sendMail({
          from: {
            name: "Equipe App BoraTomarUma",
            address: "app.boratomaruma@gmail.com",
          },
          to: participant.email,
          subject: `Confirme sua presença na saídeira para: ${trip.destination} em ${formattedDateAtTrip.start}`,
          html: `
            <p>
                Você foi convidado(a) para uma viagem para <strong>${trip.destination}</strong>, Brasil nas datas de 
                <strong>${formattedDateAtTrip.start} até ${formattedDateAtTrip.end}</strong>.
            </p>
            <br/>
            <p style="font-weight: bold; color: #a45c04;">Para confirmar sua saídeira, clique no link abaixo:</p>
            <br/>
            <p>
              <a href="${confirmationLink}" style="background-color: #ff8800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Confirmar saídeira
              </a>
            </p>
            <br/>
            <p style="font-style: italic;">Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            <br/>
            <p style="font-size: 18px; font-weight: bold;"><emfase>BoraTomarUma</emfase></p>
          `.trim()
        });

        console.log(nodemailer.getTestMessageUrl(message));
      })
    );


    return reply.redirect(`http://localhost:8000/trips/${tripId}`);
  });
}

export {confirmTrip};

