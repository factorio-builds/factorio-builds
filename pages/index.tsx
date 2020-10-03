import { GetServerSideProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import BuildCardList from "../components/BuildCardList"
import Filters from "../components/Filters"
import SearchInput from "../components/SearchInput"
import { initializeStore, IStoreState } from "../redux/store"
import { IBuild } from "../types"
import db from "../db/models"
import { decodeBlueprint, isBook } from "../utils/blueprint"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds.items)
  return (
    <Layout
      sidebar={
        <>
          <SearchInput />
          <Filters />
        </>
      }
    >
      <BuildCardList items={builds} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  // @ts-ignore
  const builds: IBuild[] = await db.build
    .findAll({
      attributes: ["id", "owner_id", "name", "blueprint", "metadata"],
    })
    // @ts-ignore
    .catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })

  const deserializedBuilds: IBuild[] = JSON.parse(JSON.stringify(builds))

  // temp until part of data structure/metadata
  const tempBuilds = deserializedBuilds.map((build) => {
    const decodedBlueprint = decodeBlueprint(build.blueprint)
    return {
      ...build,
      isBook: isBook(decodedBlueprint),
    }
  })

  console.log(tempBuilds)

  dispatch({
    type: "SET_BUILDS",
    payload: tempBuilds,
  })

  return { props: { initialReduxState: reduxStore.getState() } }
}

export default IndexPage
