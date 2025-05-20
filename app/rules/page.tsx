"use client";
import { AppHeader } from "@/components/AppHeader";
import { VerticalFlex } from "@/components/verticalFlex";
import { HorizontalFlex } from "@/components/horizontalFlex";
import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function RulesPage() {
  const { toggleTheme, darkMode } = useTheme();
  const router = useRouter();

  return (
    <div className="page-wrapper">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <HorizontalFlex gap={24}>
          {/* First card */}
          <div
            style={{
              backgroundColor: darkMode ? "#2d2d2d" : "#f9f9f9",
              color: darkMode ? "#fff" : "#000",
              width: "30vw",
              minHeight: "60vh",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppHeader onToggleTheme={toggleTheme} />
            <VerticalFlex hug gap={16}>
              <h1
                className="title-animated"
                style={{ textAlign: "center", margin: 0 }}
              >
                Rules
              </h1>
              <div
                className={`rules-scroll ${
                  darkMode ? "dark-scroll" : "light-scroll"
                }`}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginTop: "1rem",
                  maxHeight: "60vh",
                  paddingRight: "0.5rem",
                }}
              >
                <ol style={{ textAlign: "left", lineHeight: 1.6 }}>
                  <li>
                    <strong>Setup:</strong> 3+ players join a room. One is
                    randomly assigned as the <em>Spy</em>, the others as{" "}
                    <em>Innocents</em>. Admin can change the game settings.
                    Logged-in users have win/loss stats recorded.
                  </li>
                  <li style={{ marginTop: "0.2rem" }}>
                    <strong>Start Round:</strong> Nine random Google Maps images
                    appear. Innocents see the highlighted target image; the Spy
                    sees all images unmarked.
                  </li>
                  <li style={{ marginTop: "0.2rem" }}>
                    <strong>Discuss:</strong> Use built-in chat or your own
                    voice chat to ask questions. During the round, each player
                    asks a question to a player of their choice. To keep the
                    discussion structured, Innocents are strongly advised not to
                    ask new questions while someone is answering. Innocents ask
                    questions to spot the Spy; the Spy listens for clues about
                    the target while roleplaying as if they know the image.
                  </li>
                  <li style={{ marginTop: "0.2rem" }}>
                    <strong>Decide:</strong>
                    <div style={{ marginTop: "0.2rem" }}>
                      <div style={{ marginLeft: "1rem" }}>
                        Everyone can start a vote against anyone. If the
                        majority votes yes in a vote against someone the game
                        ends.
                      </div>
                      <div style={{ marginLeft: "2rem" }}>
                        - If the player voted out is the Spy = Innocents win;
                      </div>
                      <div style={{ marginLeft: "2rem" }}>
                        - If the player voted out is an Innocent = Spy wins
                      </div>
                      <div style={{ marginLeft: "1rem", marginTop: "0.75rem" }}>
                        Spy can guess the target image anytime during the round,
                        as long as no voting session is active.
                      </div>
                      <div style={{ marginLeft: "2rem" }}>
                        - Correct guess = Spy wins;
                      </div>
                      <div style={{ marginLeft: "2rem" }}>
                        - Incorrect guess = Innocents win.
                      </div>
                      <div style={{ marginLeft: "1rem", marginTop: "0.75rem" }}>
                        If the game timer runs out, the spy wins because the
                        Innocents failed to decide.
                      </div>
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      Voting is final: your first vote counts and cannot be
                      changed. The voting session ends when the timer expires or
                      everyone has voted.
                    </div>
                  </li>
                  <li style={{ marginTop: "0.2rem" }}>
                    <strong>Reveal & Next:</strong> After the round ends, player
                    roles and target image are revealed. Admin can adjust region
                    and timer settings before starting the next round.
                  </li>
                </ol>
              </div>
              <HorizontalFlex gap={16}>
                <Button onClick={() => router.back()}>Back</Button>
              </HorizontalFlex>
            </VerticalFlex>
          </div>

          {/* Second card */}
          <div
            style={{
              backgroundColor: darkMode ? "#2d2d2d" : "#f9f9f9",
              color: darkMode ? "#fff" : "#000",
              width: "30vw",
              minHeight: "60vh",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppHeader onToggleTheme={toggleTheme} />
            <VerticalFlex hug gap={16}>
              <h1
                className="title-animated"
                style={{ textAlign: "center", margin: 0 }}
              >
                Strategy
              </h1>
              <div
                className={`rules-scroll ${
                  darkMode ? "dark-scroll" : "light-scroll"
                }`}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginTop: "1rem",
                  maxHeight: "60vh",
                  paddingRight: "0.5rem",
                }}
              >
                <ol style={{ textAlign: "left", lineHeight: 1.6 }}>
                  <li>
                    <strong>Innocents:</strong>
                    <div style={{ marginTop: "0.2rem" }}>
                      <div style={{ marginLeft: "1rem" }}>
                        - Ask questions that are ambiguous enough so the Spy can
                        not figure out the target image, but still clear enough
                        for Innocents to answer accurately.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - Think about how many images the Spy can eliminate
                        based on your question: The fewer they can eliminate,
                        the better your question is for Innocents.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - Answer questions clearly. Unclear answers may raise
                        suspicion and unintentionally help the Spy.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - Track the discussion closely and ask the player you
                        suspect most.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - Examples of generally good questions (though
                        effectiveness depends on the current images):
                      </div>
                      <div style={{ marginLeft: "3rem" }}>
                        - How many different people would you expect to see here
                        on a typical weekday at noon?
                      </div>
                      <div style={{ marginLeft: "3rem" }}>
                        - Out of 100, how safe would you feel walking alone here
                        at night?
                      </div>
                    </div>
                  </li>
                  <li style={{ marginTop: "1rem" }}>
                    <strong>Spy:</strong>
                    <div style={{ marginTop: "0.2rem" }}>
                      <div style={{ marginLeft: "1rem" }}>
                        - Follow the discussion closely and try to identify the
                        target image by logically eliminating the unlikely ones.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - When you&apos;re asked a question, adjust your answer
                        based on what&apos;s been said so far:
                      </div>
                      <div style={{ marginLeft: "3rem" }}>
                        If you&apos;re unsure about the target image, give a
                        vague but believable answer. Just be aware it might
                        raise suspicion.
                      </div>
                      <div style={{ marginLeft: "3rem" }}>
                        If you&apos;ve narrowed down the options, shape your
                        answer to fit the remaining images.
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        - If you&apos;ve raised too much suspicion, and feel
                        like you will be voted out, submit your best guess
                        before it&apos;s too late.
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
              <HorizontalFlex gap={16}>
                <Button onClick={() => router.back()}>Back</Button>
              </HorizontalFlex>
            </VerticalFlex>
          </div>
        </HorizontalFlex>
      </div>

      <style jsx>{`
        .rules-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .rules-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .dark-scroll::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
        .light-scroll::-webkit-scrollbar-thumb {
          background-color: #aaa;
          border-radius: 4px;
        }
        .rules-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #777;
        }
      `}</style>
    </div>
  );
}
