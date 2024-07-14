import fastify from "fastify";
import {createTrip} from "./routes/create-trip";
import {serializerCompiler, validatorCompiler} from "fastify-type-provider-zod";
import {confirmTrip} from "./routes/confirm-trip";
import fastifyCors from "@fastify/cors";
import {confirmParticipant} from "./routes/confirm-participant";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);

app.listen({ port: 8000 }).then(() => {
  console.log("Server is running....");
});
