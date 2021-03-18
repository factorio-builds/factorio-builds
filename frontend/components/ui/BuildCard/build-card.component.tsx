import React from "react"
import { usePress } from "@react-aria/interactions"
import cx from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { IThinBuild } from "../../../types/models"
import BuildIcon from "../BuildIcon"
import WithIcons from "../WithIcons"
import * as SC from "./build-card.styles"

interface IBuildCardProps {
  title: IThinBuild["title"]
  icons: IThinBuild["icons"]
  isBook: boolean
  categories: IThinBuild["tags"]
  image: IThinBuild["_links"]["cover"]
  link: string
  tabIndex: number
}

function BuildCard({
  title,
  icons,
  isBook,
  categories = [],
  image,
  link,
  tabIndex,
  ...restProps
}: IBuildCardProps): JSX.Element {
  const router = useRouter()
  const { pressProps, isPressed } = usePress({
    onPress: () => {
      router.prefetch(link)
      router.push(link)
    },
  })

  return (
    <Link href={link}>
      <SC.BuildCardWrapper
        {...pressProps}
        {...restProps}
        role="button"
        tabIndex={tabIndex}
        className={cx({ "is-pressed": isPressed })}
      >
        <SC.ImageWrapper>
          <Image
            src={image.href}
            alt=""
            width={image.width}
            height={image.height}
            layout="responsive"
          />
        </SC.ImageWrapper>
        <SC.Content>
          <SC.Title orientation="horizontal" gutter={8}>
            {icons.length > 0 && <BuildIcon icons={icons} />}
            <WithIcons
              input={title}
              prefix={
                isBook ? (
                  <img src="/img/blueprint-book.png" alt="" />
                ) : undefined
              }
            />
          </SC.Title>
          <SC.Categories orientation="horizontal" gutter={8}>
            {categories.map((category) => {
              return <SC.Category key={category}>{category}</SC.Category>
            })}
          </SC.Categories>
        </SC.Content>
      </SC.BuildCardWrapper>
    </Link>
  )
}

export default BuildCard
