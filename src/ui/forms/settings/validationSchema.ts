import * as Yup from 'yup';

// const Link = Yup.string().matches(
//   /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
//   'Enter correct url!'
// );

const validationSchema = Yup.object().shape({
  interval: Yup.number().min(0.5).max(30).required(),
  random: Yup.boolean(),
  links: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        // value: Link,
        value: Yup.string().url(),
      })
    )
    /**
     * validate link array min length of links
     */
    .test({
      message: 'specify at least two links',
      test: (arr) => {
        if (!arr) return false;

        const linkValues = arr
          .map(({ value }) => value)
          .filter((item) => Boolean(item));

        return linkValues.length >= 2;
      },
    }),
});

export default validationSchema;
