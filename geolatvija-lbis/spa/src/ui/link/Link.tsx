import {StyledLink} from "./style";

interface LinkProps {
  label: string,
  url: string,
  target?: string,
  download?: boolean,
}

const Link = ({label, url, target = '_blank', download = false}: LinkProps) => {
  return (
    <>
      <StyledLink href={url} target={target} {...(download && {download})}>
        {label}
      </StyledLink>
    </>
  )
}

export default Link
