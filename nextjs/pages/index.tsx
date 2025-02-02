import type { NextPage } from "next";
import Head from "next/head";
import { allBanners, featureCategory } from "../api";
import ItemContainer from "../components/client/Items/ItemContainer";
import AppLayout from "../components/Layouts/AppLayout";
import Search from "../components/client/Search";
import { BANNER, CATEGORY } from "../types";
import Banner from "../components/client/Banner";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AppState } from "../context/AppProvider";
import { setCookie } from "cookies-next";

interface Props {
  categories: CATEGORY[];
  banners: BANNER[];
}

const Home: NextPage<Props> = ({ categories, banners }) => {
  const router = useRouter();
  const { setUser } = AppState();

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/google-auth/callback?code=${router.query.code}&scope=${router.query.scope}&authuser=${router.query.authuser}&prompt=${router.query.prompt}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setUser(response.data);
        setCookie("jwt", response.data.token, {
          maxAge: 60 * 60 * 24 * 30, //1month
        });
        setCookie("fastfood_auth", response.data.user, {
          maxAge: 60 * 60 * 24 * 30, //1month
        });
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Search />
      <div className="w-full md:mx-auto md:w-2/3">
        <Banner banners={banners} />
        <div className="w-full md:w">
          {categories.map((category: any) => (
            <ItemContainer
              key={category.slug}
              title={category.name}
              menus={category.menus}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export async function getServerSideProps() {
  const categories = await featureCategory();
  const banners = await allBanners();

  return {
    props: {
      categories: categories.data.data,
      banners: banners.data.data,
    },
  };
}

export default Home;
