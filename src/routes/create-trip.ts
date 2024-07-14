import {FastifyInstance} from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import {z} from "zod";

import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

import { dayjs } from "../lib/dayjs";
import {prisma} from "../lib/prisma";
import {getMailClient} from "../lib/mail";

async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trips", {
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email()),
      })
    }
  }, async (request) => {
    const {
      destination,
      starts_at,
      ends_at,
      owner_name,
      owner_email,
      emails_to_invite
    } = request.body;

    if (dayjs(starts_at).isBefore(new Date())) {
      throw new Error("Invalid trip start date");
    }
    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new Error("Invalid trip end date");
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true
              },
              ...emails_to_invite.map( email => {
                return { email }
              })
            ]
          }
        }
      }
    });

    const formattedDateAtTrip = {
      start: dayjs(starts_at).format('LL'),
      end: dayjs(ends_at).format('LL')
    }

    const confirmationLink = `http://localhost:8000/trips/${trip.id}/confirm`;

    const mail: Mail<SMTPTransport.SentMessageInfo> = await getMailClient();
    const message: SMTPTransport.SentMessageInfo = await mail.sendMail({
      from: {
        name: "Equipe App BoraTomarUma",
        address: "app.boratomaruma@gmail.com",
      },
      to: {
        name: owner_name,
        address: owner_email
      },
      subject: `Confirme sua saídeira para: ${destination} em ${formattedDateAtTrip.start}`,
      html: `
        <p>
            Você solicitou a criação de uma viagem para <strong>${destination}</strong>, Brasil nas datas de 
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
        <p></p>
        <p style="font-size: 18px; font-weight: bold;"><emfase>BoraTomarUma</emfase></p>
      `.trim()
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return {tripId: trip.id};
  });
}


export {createTrip};
