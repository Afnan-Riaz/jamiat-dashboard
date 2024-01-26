const { name, password } = process.env;
export const connectionStr: string = `mongodb+srv://${name}:${password}@cluster0.ovilnum.mongodb.net/Jamiat?retryWrites=true&w=majority`;
