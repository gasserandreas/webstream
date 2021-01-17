import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  filename: Yup.string().required(),
});

export default validationSchema;
