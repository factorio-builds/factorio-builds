import React, { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useSelector } from "react-redux"
import cx from "classnames"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import Link from "next/link"
import BuildSubheader from "../../components/ui/BuildSubheader"
import Layout from "../../components/ui/Layout"
import { Build } from "../../db/entities/build.entity"
import Caret from "../../icons/caret"
import { IStoreState } from "../../redux/store"
import { ERole, EState } from "../../types"
import { decodeBlueprint, getCountPerItem, isBook } from "../../utils/blueprint"
import * as SC from "./build-page.styles"

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return (
    <SC.StyledRequiredItem>
      {props.count}
      <SC.IconImg src={iconSrc} />
      {props.itemName.replace(/-/g, " ")}
    </SC.StyledRequiredItem>
  )
}

interface IBuildPageProps {
  build: Build
}

const AsideGroup: React.FC<{ title?: string }> = (props) => {
  return (
    <SC.AsideGroup>
      <SC.AsideGroupTitle>{props.title}</SC.AsideGroupTitle>
      {props.children}
    </SC.AsideGroup>
  )
}

function BuildPage({ build }: IBuildPageProps): JSX.Element {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const [blueprintExpanded, setBlueprintExpanded] = useState(false)
  const [blueprintFormat, setBlueprintFormat] = useState<"base64" | "json">(
    "base64"
  )

  const toggleExpandBlueprint = () => {
    setBlueprintExpanded((expanded) => !expanded)
  }

  const blueprintJSON = decodeBlueprint(build.blueprint)

  const blueprintData = useMemo(() => {
    if (blueprintFormat === "json") {
      return JSON.stringify(blueprintJSON, null, 1)
    }

    return build.blueprint
  }, [build.blueprint, blueprintFormat])

  const itemsCount = useMemo(() => {
    if (!isBook(blueprintJSON)) {
      return getCountPerItem(blueprintJSON.blueprint)
    }
    return {}
  }, [build.blueprint])

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "yyyy-MM-dd")
  }

  const formatSince = (isoString: string) => {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  }

  const formatGameState = (gameState: EState) => {
    switch (gameState) {
      case EState.EARLY_GAME:
        return "Early-game"
      case EState.MID_GAME:
        return "Mid-game"
      case EState.LATE_GAME:
        return "Late-game"
    }
  }

  const sortedRequiredItems = useMemo(() => {
    return Object.keys(itemsCount)
      .map((itemName) => {
        return {
          count: itemsCount[itemName],
          name: itemName,
        }
      })
      .sort((a, b) => {
        if (a.count === b.count) return 0

        return a.count < b.count ? 1 : -1
      })
  }, [itemsCount])

  const isAdmin = user?.roleName === ERole.ADMIN
  const ownedByMe = build.owner.id === user?.id

  return (
    <Layout
      title={build.name}
      subheader={
        <BuildSubheader build={build} isBook={isBook(blueprintJSON)} />
      }
      sidebar={
        <SC.BuildImage>
          {build.image ? <img src={build.image.src} alt="" /> : "No image"}
        </SC.BuildImage>
      }
    >
      <SC.Wrapper>
        <SC.Content>
          <SC.Aside>
            {(isAdmin || ownedByMe) && (
              <AsideGroup>
                <Link href={`/build/${build.id}/edit`}>
                  <SC.EditBuild>
                    {ownedByMe ? "edit build" : "edit build as admin"}
                  </SC.EditBuild>
                </Link>
              </AsideGroup>
            )}
            <AsideGroup>by {build.owner.name}</AsideGroup>
            <AsideGroup>
              <SC.AsideSubGroup>
                published on <b>{formatDate(build.createdAt)}</b>
                <br />({formatSince(build.createdAt)})
              </SC.AsideSubGroup>
              <SC.AsideSubGroup>
                edited on <b>{formatDate(build.updatedAt)}</b>
                <br />({formatSince(build.updatedAt)})
              </SC.AsideSubGroup>
            </AsideGroup>
            <AsideGroup title="Categories">
              {build.metadata.categories.map((category) => (
                <div key={category}>{category}</div>
              ))}
            </AsideGroup>
            <AsideGroup title="Game state">
              {formatGameState(build.metadata.state)}
            </AsideGroup>
            {!isBook(blueprintJSON) && (
              <AsideGroup title="Required items">
                {sortedRequiredItems.map((item) => {
                  return (
                    <RequiredItem
                      key={item.name}
                      itemName={item.name}
                      count={item.count}
                    />
                  )
                })}
              </AsideGroup>
            )}

            {isBook(blueprintJSON) && (
              <AsideGroup title="Blueprints">
                {blueprintJSON.blueprint_book.blueprints.map((bp, index) => {
                  return <div key={index}>{bp.blueprint.label}</div>
                })}
              </AsideGroup>
            )}
          </SC.Aside>
          <SC.Main>
            <SC.MainTitle>Description</SC.MainTitle>

            <SC.MainContent>
              <ReactMarkdown source={build.description} />
              <p>ID: {build.id}</p>
            </SC.MainContent>

            <SC.ExpandBlueprint onClick={toggleExpandBlueprint}>
              expand blueprint <Caret inverted={blueprintExpanded} />
            </SC.ExpandBlueprint>

            {blueprintExpanded && (
              <SC.Blueprint>
                <SC.TogglerWrapper>
                  <SC.Toggler
                    className={cx({
                      "is-selected": blueprintFormat === "base64",
                    })}
                    onClick={() => setBlueprintFormat("base64")}
                  >
                    base64
                  </SC.Toggler>
                  <SC.Toggler
                    className={cx({
                      "is-selected": blueprintFormat === "json",
                    })}
                    onClick={() => setBlueprintFormat("json")}
                  >
                    json
                  </SC.Toggler>
                </SC.TogglerWrapper>
                <SC.BlueprintData
                  value={blueprintData}
                  rows={5}
                  readOnly
                  onClick={(e) => e.currentTarget.select()}
                />
              </SC.Blueprint>
            )}
          </SC.Main>
        </SC.Content>
      </SC.Wrapper>
    </Layout>
  )
}

export default BuildPage