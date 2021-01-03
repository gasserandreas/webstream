import * as Yup from 'yup';

const Link = Yup.string().matches(
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  'Enter correct url!'
);

const validationSchema = Yup.object().shape({
  interval: Yup.number().min(0.5).max(30).required(),
  random: Yup.boolean(),
  links: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        value: Link,
      })
    )
    .test({
      message: 'At least two links must be configured',
      test: (arr) => {
        if (!arr) return true;
        return arr.length <= 1;
      },
    }),
});

export default validationSchema;
