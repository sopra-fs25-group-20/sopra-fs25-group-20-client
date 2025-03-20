"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
// import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

export default function Home() {
  // const router = useRouter();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <p>This is sopra-fs25-group-20&apos;s</p>
          <h1>SpyQuest!</h1>
        </div>
        <div className={styles.ctas}>
          <Button
            type="primary" // as defined in the ConfigProvider in [layout.tsx](./layout.tsx), all primary antd elements are colored #22426b, with buttons #75bd9d as override
            color="red" // if a single/specific antd component needs yet a different color, it can be explicitly overridden in the component as shown here
            variant="solid" // read more about the antd button and its options here: https://ant.design/components/button
            onClick={() =>
              globalThis.open(
                "https://github.com/sopra-fs25-group-20",
                "_blank",
                "noopener,noreferrer",
              )}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        </div>
      </main>
    </div>
  );
}
