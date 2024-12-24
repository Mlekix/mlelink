import * as Yup from "yup";

const validationSchema = Yup.object({
  cardName: Yup.string()
    .min(3, "Too short")
    .max(25, "Too long")
    .required("Required"),
  bio: Yup.string().max(70, "Too long"),
  links: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Link name is required"),
        url: Yup.string().url("Invalid URL format").required("URL is required"),
      })
    )
    .min(1, "At least one link is required")
    .max(5, "Too many links"),
});

export default validationSchema;
