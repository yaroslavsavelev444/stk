import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  // Line, // ← удалён неиспользуемый импорт
} from "@once-ui-system/core";
import { home, about, person, baseURL } from "@/resources/content";
import { CategoriesGrid } from "@/components/categories";
// import { Projects } from "@/components/work/Projects";
import { CallbackSection } from "@/components/callback-form/CallbackSection";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
              trigger={true}   // ← теперь boolean
              delay={0}
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="center"
            paddingBottom="16"
            trigger={true}
            delay={0.05}
          >
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx
            translateY="8"
            fillWidth
            horizontal="center"
            paddingBottom="32"
            trigger={true}
            delay={0.1}
          >
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx
            paddingTop="12"
            horizontal="center"
            paddingLeft="12"
            trigger={true}
            delay={0.15}
          >
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                О компании
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx
        translateY="16"
        fillWidth
        trigger={true}
        delay={0.2}
      >
        <CategoriesGrid />
      </RevealFx>

      <CallbackSection />
      {/* <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 3]} /> 
      </RevealFx> */}
    </Column>
  );
}