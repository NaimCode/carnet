
import Input from "@ui/components/input";
import { EmailIcon, EntrepriseIcon, PasswordIcon, PersonIcon, TelIcon } from "@ui/icons";
import React, { useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PRIVACY_POLICY_URL, TERMS_URL } from "@data/link";
import { type TSignupBidder } from "@model/type";
import Auth from "@ui/auth";
import SignupLayout from "@ui/signup";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import cx  from 'classnames';
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  return {props:{}}

};
const Bidder = () => {
  const [agree, setagree] = useState(false);
  const [remember, setremember] = useState(true);
  //const {onCreateUser,createUserDocLoading}=useCreateUserDoc()
  const { register, handleSubmit, watch, formState } =
    useForm<TSignupBidder>({
      mode: "onChange",
    });
  
  const { errors } = formState;
  const router=useRouter()
  const {mutate:signup,isLoading}=trpc.auth.signUp.useMutation({
    onError:(err)=>{
     console.log("Auth signup",err)
     
     toast.error(err.message)
    },
    onSuccess:(user)=>{
       console.log('user after signup',user)
       toast.success("Inscription réussie")
       
       signIn('credentials',{
        email:user.email,
        password:watch('password'),
        redirect:false,
       }).then(()=>{
        router.replace('/dashboard')
       }).catch(()=>{
        router.push('/auth/login')
       })
       //TODO:Signin
    }
  })
  

  const onSubmit: SubmitHandler<TSignupBidder> = async(data) => {
    signup({
      ...data, type: "BID"
    })
  };
  return (
    <Auth>
     <SignupLayout>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
    <Input
              label="Nom d'utilisateur"
              error={errors.username}
              icon={<PersonIcon />}
              controler={{
                ...register("username", { required: "Champs obligatoire" }),
              }}
            />
      <div className="flex flex-row gap-4">
        <Input
          label="Email"
          error={errors.email}
          icon={<EmailIcon />}
          controler={{
            ...register("email", {
              required: "Champs obligatoire",
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email invalide",
              },
            }),
          }}
        />
        <Input
          label="Tél"
          error={errors.tel}
          controler={{ ...register("tel", { required: "Champs obligatoire" }) }}
          icon={<TelIcon />}
        />
      </div>
      <Input
          label="Nom entreprise"
          error={errors.nomEntreprise}
          controler={{
            ...register("nomEntreprise", { required: "Champs obligatoire" }),
          }}
          icon={<EntrepriseIcon />}
        />
      <div className="flex flex-row gap-4">
        <Input
          label="Password"
          error={errors.password}
          type="password"
          icon={<PasswordIcon />}
          controler={{
            ...register("password", {
              required: "Champs obligatoire",
              minLength: {
                value: 6,
                message: "La taille doit dépasser 6 caractères",
              },
            }),
          }}
        />
        <Input
          label="Confirmation de password"
          type="password"
          error={errors.confirmPassword}
          controler={{
            ...register("confirmPassword", {
              required: "Champs obligatoire",
              validate: {
                isValid: (v) =>
                  v == watch("password")
                    ? true
                    : "Ne correspond pas au password",
              },
            }),
          }}
          icon={<PasswordIcon />}
        />
      </div>
      <div className="flex flex-row gap-3 items-center text-opacity-75">
        <input
          type="checkbox"
          checked={remember}
          onChange={(v) => setremember(v.currentTarget.checked)}
          className="checkbox checkbox-sm  checkbox-primary"
        />
        <span>Remember Me</span>
      </div>
      <div className="h-[10px]"></div>
      <div className="flex flex-row gap-3 items-center  text-opacity-75">
        <input
          type="checkbox"
          checked={agree}
          onChange={(v) => setagree(v.currentTarget.checked)}
          className="checkbox checkbox-sm  checkbox-primary"
        />
        <span>
          I agree to all{" "}
          <Link target={"_blank"} href={TERMS_URL} className="text-primary">
            the terms
          </Link>{" "}
          and{" "}
          <Link
            target={"_blank"}
            href={PRIVACY_POLICY_URL}
            className="text-primary"
          >
            Privacy policy
          </Link>
        </span>
      </div>
      <div className="h-[30px]"></div>
      <button
        type="submit"
        className={cx("btn btn-primary px-7 btn-wide rounded-2xl",{
          loading:isLoading,
          "btn-disabled":!agree
        })}
      >
        Créer un compte
      </button>
      <div className="h-[20px]"></div>
      <p>
        Already have account ?{" "}
        <Link href="/auth/login" className="text-primary">
          login
        </Link>
      </p>
    </form>
    </SignupLayout>
   </Auth>
  );
};

export default Bidder;

