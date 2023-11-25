import { useState } from "react";
import { Formik } from "formik";

import UserPhotoDefault from "../../assets/icons/user_photo_default.svg";
import {
  UserProfileContainer,
  UserPhotoBox,
  Form,
  LogoutBtn,
  UserImg,
  Label,
  Input,
  SubmitBtn,
  EditImg,
  UserProfileSection,
} from "./UserProfile.styled";
import {  useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import {  userInfo } from "../../redux/auth/selectors";

export default function UserProfile() {
  const [editable, setEditable] = useState(false);
  const  currentUserInfo  = useSelector(userInfo);
  console.log(currentUserInfo)
  const editHandler = (e) => {
    if (e.target.nodeName === "IMG") {
      return;
    }
    setEditable((prevState) => !prevState);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = () => {
      try {
       
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

      fetchData();
    
  }, [dispatch]);



  const handleChange = (e) => {
    console.log(e);
    console.log("tut");
  };

  return (
    <>
      <UserProfileSection>
        <h2>My information:</h2>
        <UserProfileContainer>
          <UserPhotoBox onClick={editHandler}>
            <UserImg src={UserPhotoDefault} alt="User profile" />
            {editable ? <EditImg>Edit photo</EditImg> : ""}
          </UserPhotoBox>
          <Formik
            initialValues={{
              name: currentUserInfo?.name || "",
              email: currentUserInfo?.email || "",
              birthday: "00.00.0000",
              phone: "+380",
              city: "Kyiv",
            }}
            onSubmit={(values, actions) => {
              //  setTimeout(() => {
              //    alert(JSON.stringify(values, null, 2));
              //    actions.setSubmitting(false);
              //  }, 1000);
              console.log("this is submit");
            }}
            onChange={(values, actions) => {
              console.log(actions);
              console.log("onchange");
            }}
            handleChange={(e) => {
              console.log(e);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Label>
                  <div>Name:</div>
                  <Input
                    type="text"
                    onChange={props.onChange}
                    value={props.values.name}
                    name="name"
                    disabled={!editable}
                  />
                </Label>
                <Label>
                  <div>Email:</div>
                  <Input
                    type="text"
                    onChange={handleChange}
                    value={props.values.email}
                    name="email"
                    disabled={!editable}
                  />
                </Label>
                <Label>
                  <div>Birthday:</div>
                  <Input
                    type="text"
                    onChange={handleChange}
                    value={props.values.birthday}
                    name="birthday"
                    disabled={!editable}
                  />
                </Label>
                <Label>
                  <div>Phone:</div>
                  <Input
                    type="text"
                    onChange={handleChange}
                    value={props.values.phone}
                    name="phone"
                    disabled={!editable}
                  />
                </Label>
                <Label>
                  <div>City:</div>
                  <Input
                    type="text"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.city}
                    name="city"
                    disabled={!editable}
                  />
                </Label>
                {props.errors.name && (
                  <div id="feedback">{props.errors.name}</div>
                )}
                {editable ? (
                  <SubmitBtn type="submit">Submit</SubmitBtn>
                ) : (
                  <LogoutBtn type="button">Log Out</LogoutBtn>
                )}
              </Form>
            )}
          </Formik>
        </UserProfileContainer>
      </UserProfileSection>
    </>
  );
}
