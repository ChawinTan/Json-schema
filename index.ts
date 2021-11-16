import carSchema from './test-schemas/cars.json';
import personSchema from './test-schemas/person.json';
import express, { Application, Request, Response } from "express";
import { Validator, ValidationError } from "express-json-validator-middleware";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { validate } = new Validator({});

app.get(
  "/",
  (req: Request, res: Response) => {
      res.send({
          message: "Hello World!",
      });
  }
);

app.post('/car', validate({ body: JSON.parse(JSON.stringify(carSchema))}), (req: Request, res: Response) => {
  // send back the request if schema is correct
  res.send(req.body)
})

app.post('/person', validate({ body: JSON.parse(JSON.stringify(personSchema))}), (req: Request, res: Response) => {
  // send back the request if schema is correct
  res.send(req.body)
})

app.use((error: ValidationError | Error, request: Request, response: Response, next: (error?: Error) => void) => {
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // Handle the error
    const errorStore: string[] =  [];
    error.validationErrors.body?.forEach((e) => {
      errorStore.push(`Field ${e.dataPath} ${e.message}`)
    })
    response.status(400).send(errorStore);
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

app.listen(4000)