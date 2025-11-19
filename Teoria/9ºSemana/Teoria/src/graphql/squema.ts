import {gql} from 'apollo-server';

export const schema = gql`
  
    type coche {
        id : ID!,
        name : String, 
        marca : String,
        modelo : String,

    } 

    type Query  {
        getCars : [coche!]!, 
        getCar(id: ID!) : coche,
    }

    type Mutacion {
        addCar(name : String!, marca : String!, modelo: String!): coche!,
    }
`;

