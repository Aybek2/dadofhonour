"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormAnswers } from "@/lib/types";

const STORAGE_KEY = "youloogee_form_state";
const TOTAL_STEPS = 6;

const BANNED_WORDS_THREE_WORDS = /\b(amazing|blessed|incredible)\b/i;
const BANNED_PHRASES_END_LINE =
  /not losing a daughter|gain(ing)? a son|today i (don't|dont) just gain/i;

type FullFormData = FormAnswers;

const STEP_SKIPPABLE_FIELDS: Partial<Record<number, string[]>> = {
  2: ["profession", "three_words"],
  3: ["memory_quality", "memory_scene"],
  4: ["partner_observation", "end_line"],
  5: [
    "speaker_feeling",
    "avoid",
    "thread",
    "surprise",
    "relationship",
    "what_shed_say",
    "unsaid",
    "partner_timeline",
  ],
};

const FIELD_LABELS: Record<string, string> = {
  profession: "What she does",
  three_words: "Three words that describe her",
  memory_quality: "A quality that's always been true of her",
  memory_scene: "A specific memory",
  partner_observation: "Something you've noticed about the partner",
  end_line: "Closing line",
  speaker_feeling: "How you feel about giving the speech",
  avoid: "Things to avoid",
  thread: "Something she's always done",
  surprise: "What surprised you most",
  relationship: "Your relationship in one sentence",
  what_shed_say: "What she'd say about you",
  unsaid: "Something you've never quite said",
  partner_timeline: "How long they've been together",
};

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round((step / TOTAL_STEPS) * 100)}% complete
        </span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-foreground">
        {children}
        {required && <span className="text-muted-foreground ml-1">*</span>}
      </label>
      {hint && (
        <p className="mt-1 text-sm text-muted-foreground italic">{hint}</p>
      )}
    </div>
  );
}

function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      className={cn(
        "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none",
        className
      )}
      {...props}
    />
  );
}

function InlineWarning({ message }: { message: string }) {
  return (
    <p className="mt-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
      {message}
    </p>
  );
}

function SkipButton({
  onSkip,
  label = "Skip for now",
  showWarning,
  warningText,
}: {
  onSkip: () => void;
  label?: string;
  showWarning?: boolean;
  warningText?: string;
}) {
  const [warned, setWarned] = useState(false);

  const handleSkip = () => {
    if (showWarning && !warned) {
      setWarned(true);
      return;
    }
    onSkip();
  };

  return (
    <div>
      {warned && showWarning && warningText && (
        <p className="mb-2 text-sm text-muted-foreground italic">
          {warningText}
        </p>
      )}
      <button
        type="button"
        onClick={handleSkip}
        className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
      >
        {warned && showWarning ? "Skip anyway" : label}
      </button>
    </div>
  );
}

function SkippedBadge({ onUnskip }: { onUnskip: () => void }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm text-muted-foreground italic">Skipped</span>
      <button
        type="button"
        onClick={onUnskip}
        className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
      >
        Add an answer
      </button>
    </div>
  );
}

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [skippedFields, setSkippedFields] = useState<Set<string>>(new Set());
  const [unansweredError, setUnansweredError] = useState(false);
  const [showSkipReview, setShowSkipReview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FullFormData>({
    defaultValues: {
      tone: "traditional",
      length: "4min",
    },
  });

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FullFormData>;
        (Object.entries(parsed) as [keyof FullFormData, string][]).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              setValue(key, value as never);
            }
          }
        );
      }
    } catch {
      // Ignore parse errors
    }
  }, [setValue]);

  // Persist to localStorage on every change
  const watchedValues = watch();
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues));
    } catch {
      // Ignore storage errors
    }
  }, [watchedValues]);

  const threeWordsValue = watch("three_words") ?? "";
  const endLineValue = watch("end_line") ?? "";
  const daughterName = watch("daughter_name") ?? "your daughter";
  const partnerName = watch("partner_name") ?? "her partner";

  const showThreeWordsWarning = BANNED_WORDS_THREE_WORDS.test(threeWordsValue);
  const showEndLineWarning = BANNED_PHRASES_END_LINE.test(endLineValue);

  const goNext = useCallback(async () => {
    let fieldsToValidate: (keyof FullFormData)[] = [];

    if (step === 1)
      fieldsToValidate = ["father_name", "daughter_name", "partner_name"];
    if (step === 2) fieldsToValidate = ["tone", "length"];
    if (step === 6) fieldsToValidate = ["email"];

    const valid = await trigger(fieldsToValidate);
    if (!valid) return;

    const skippable = STEP_SKIPPABLE_FIELDS[step] ?? [];
    const values = getValues();
    const hasUnanswered = skippable.some(
      (f) => !values[f as keyof FullFormData] && !skippedFields.has(f)
    );
    if (hasUnanswered) {
      setUnansweredError(true);
      return;
    }
    setUnansweredError(false);

    if (step === 5 && skippedFields.size > 0) {
      setShowSkipReview(true);
      return;
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [step, trigger, skippedFields, getValues]);

  const goBack = () => {
    setUnansweredError(false);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit: SubmitHandler<FullFormData> = async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error ??
            "Something went wrong. Please try again."
        );
      }
      const { url } = (await res.json()) as { url: string };
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = url;
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  };

  const skipField = (field: keyof FullFormData) => {
    setValue(field, "" as never);
    setSkippedFields((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
    setUnansweredError(false);
  };

  const unskipField = (field: keyof FullFormData) => {
    setSkippedFields((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  };

  const toneOptions = [
    {
      value: "traditional",
      label: "Traditional and measured",
      description: "Warm, formal, with a light dry wit.",
    },
    {
      value: "warm-witty",
      label: "Warm with a touch of humour",
      description: "Genuinely funny first half, genuinely moving by the end.",
    },
    {
      value: "emotional",
      label: "Heartfelt and emotional",
      description: "Open, direct, says everything that needs saying.",
    },
  ] as const;

  const lengthOptions = [
    { value: "2min", label: "About 2 minutes", description: "Short and sharp" },
    { value: "4min", label: "About 4 minutes", description: "The standard" },
    {
      value: "6min",
      label: "About 6 minutes",
      description: "Give it room to breathe",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← DadOfHonour.co.uk
          </a>
        </div>

        <ProgressBar step={step} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Step 1: Names ── */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Let&apos;s start with the people.
              </h1>
              <p className="text-muted-foreground mb-8">
                Three names — yours, hers, and her partner&apos;s.
              </p>

              <div className="space-y-6">
                <div>
                  <FieldLabel required>Your name</FieldLabel>
                  <TextInput
                    placeholder="e.g. David Harrison"
                    {...register("father_name", {
                      required: "Please enter your name.",
                    })}
                  />
                  {errors.father_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.father_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel required>Your daughter&apos;s name</FieldLabel>
                  <TextInput
                    placeholder="e.g. Sophie"
                    {...register("daughter_name", {
                      required: "Please enter your daughter's name.",
                    })}
                  />
                  {errors.daughter_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.daughter_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel required>Her partner&apos;s name</FieldLabel>
                  <TextInput
                    placeholder="e.g. James"
                    {...register("partner_name", {
                      required: "Please enter her partner's name.",
                    })}
                  />
                  {errors.partner_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.partner_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={goNext}
                  className="w-full rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Style + core details ── */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                How do you want it to feel?
              </h1>
              <p className="text-muted-foreground mb-8">
                Choose a tone and length. You can add more detail on the next
                steps.
              </p>

              <div className="space-y-8">
                {/* Tone */}
                <div>
                  <FieldLabel required>Tone</FieldLabel>
                  <div className="space-y-3">
                    {toneOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                          watch("tone") === opt.value
                            ? "border-foreground bg-muted"
                            : "border-border hover:border-foreground/40"
                        )}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          className="mt-0.5"
                          {...register("tone", { required: true })}
                        />
                        <div>
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <FieldLabel required>Length</FieldLabel>
                  <div className="space-y-3">
                    {lengthOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                          watch("length") === opt.value
                            ? "border-foreground bg-muted"
                            : "border-border hover:border-foreground/40"
                        )}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          className="mt-0.5"
                          {...register("length", { required: true })}
                        />
                        <div>
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <FieldLabel hint="Her job, career, or main passion.">
                    {"What does "}
                    {daughterName}
                    {" do?"}
                  </FieldLabel>
                  {skippedFields.has("profession") ? (
                    <SkippedBadge onUnskip={() => unskipField("profession")} />
                  ) : (
                    <>
                      <TextInput
                        placeholder="e.g. Secondary school English teacher"
                        {...register("profession")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("profession")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Three words */}
                <div>
                  <FieldLabel
                    hint={`Give us three words that describe ${daughterName} — and for each, a sentence on why. e.g. "Stubborn — because once she decided something was going to happen, it happened."`}
                  >
                    {"Three words that describe "}
                    {daughterName}
                  </FieldLabel>
                  {skippedFields.has("three_words") ? (
                    <SkippedBadge onUnskip={() => unskipField("three_words")} />
                  ) : (
                    <>
                      <TextArea
                        placeholder="e.g. Determined — she rebuilt the model twice when it collapsed. Quietly funny — it tends to catch you off guard. Loyal — steadfastly, practically loyal to the people who matter."
                        rows={4}
                        {...register("three_words")}
                      />
                      {showThreeWordsWarning && (
                        <InlineWarning message="This word appears in almost every speech — can you think of something more specific?" />
                      )}
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("three_words")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {unansweredError && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  Please answer each question or skip it to continue.
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-md border border-border py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Memory ── */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                {"Tell us about "}
                {daughterName}.
              </h1>
              <p className="text-muted-foreground mb-8">
                The speech is built from this. The more concrete, the better.
              </p>

              <div className="space-y-6">
                {/* Memory quality — Q6 */}
                <div>
                  <FieldLabel hint="A quality, habit, or way she approaches things. This is the lead-in to the next question.">
                    {"What is something about "}
                    {daughterName}
                    {" that’s always been true of her?"}
                  </FieldLabel>
                  {skippedFields.has("memory_quality") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("memory_quality")}
                    />
                  ) : (
                    <>
                      <TextArea
                        placeholder={`e.g. "She's stubborn in the best way — once she decides something, it happens." Or: "She's always been the one who actually shows up."`}
                        {...register("memory_quality")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("memory_quality")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Memory scene — Q6b — most important */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      One specific moment where you saw that
                    </label>
                    <span className="text-xs bg-foreground text-background rounded px-1.5 py-0.5 font-medium">
                      Most important
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground italic">
                    Where were you? What did she do or say? Even a small moment
                    — the speech is built from this.
                  </p>
                  {skippedFields.has("memory_scene") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("memory_scene")}
                    />
                  ) : (
                    <>
                      <TextArea
                        rows={5}
                        placeholder={`e.g. "She was about eight. She spent three weeks building a model of the Globe Theatre from a cardboard box and lolly sticks. It collapsed twice. She rebuilt it both times. Came home with a certificate and a face like she'd built the real thing."`}
                        {...register("memory_scene")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("memory_scene")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {unansweredError && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  Please answer each question or skip it to continue.
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-md border border-border py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Partner + end line ── */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                {"Tell us about "}
                {partnerName}.
              </h1>
              <p className="text-muted-foreground mb-8">
                And how you want to end.
              </p>

              <div className="space-y-6">
                {/* Partner observation — Q7 */}
                <div>
                  <FieldLabel
                    hint={`Not a category ("he's kind") — something particular. A moment, or something you've observed more than once.`}
                  >
                    {"One specific thing you’ve noticed about "}
                    {partnerName}
                  </FieldLabel>
                  {skippedFields.has("partner_observation") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("partner_observation")}
                    />
                  ) : (
                    <>
                      <TextArea
                        placeholder={`e.g. "Last winter, before ${daughterName} even asked him to, he came to the house to help when things were difficult. Just showed up. No fuss."`}
                        {...register("partner_observation")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("partner_observation")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* End line — Q11 */}
                <div>
                  <FieldLabel hint="Optional. The last thing you'll say before the toast — often the most remembered line.">
                    If you could end on one line, what would it be?
                  </FieldLabel>
                  {skippedFields.has("end_line") ? (
                    <SkippedBadge onUnskip={() => unskipField("end_line")} />
                  ) : (
                    <>
                      <TextInput
                        placeholder={`e.g. "She's always known her own mind. I'm glad she found someone who respects that."`}
                        {...register("end_line")}
                      />
                      {showEndLineWarning && (
                        <InlineWarning message="This line appears in a lot of speeches — it might land better if it's yours." />
                      )}
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("end_line")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {unansweredError && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  Please answer each question or skip it to continue.
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-md border border-border py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Extra details ── */}
          {step === 5 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                A few more details.
              </h1>
              <p className="text-muted-foreground mb-8">
                Core questions first, then some optional extras. Each one adds
                depth — but all can be skipped.
              </p>

              <div className="space-y-6">
                {/* Speaker feeling — QG */}
                <div>
                  <FieldLabel hint="Nervous, dreading it, quietly ready, looking forward to it? This controls the opening of your speech.">
                    How do you feel about giving this speech?
                  </FieldLabel>
                  {skippedFields.has("speaker_feeling") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("speaker_feeling")}
                    />
                  ) : (
                    <>
                      <TextInput
                        placeholder="e.g. Nervous but ready. I've been practising in the car."
                        {...register("speaker_feeling")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("speaker_feeling")}
                          showWarning
                          warningText="This is where the best material usually comes from — your speech will still be great, but this is worth taking a moment on."
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Avoid — Q10 */}
                <div>
                  <FieldLabel hint="Topics, people, events — anything that shouldn't appear. If blank, nothing is avoided.">
                    Is there anything you&apos;d like us not to mention?
                  </FieldLabel>
                  {skippedFields.has("avoid") ? (
                    <SkippedBadge onUnskip={() => unskipField("avoid")} />
                  ) : (
                    <>
                      <TextInput
                        placeholder="e.g. Her job before this one, or the trip to Spain."
                        {...register("avoid")}
                      />
                      <div className="mt-2">
                        <SkipButton onSkip={() => skipField("avoid")} />
                      </div>
                    </>
                  )}
                </div>

                <hr className="border-border" />
                <p className="text-sm text-muted-foreground">
                  Optional extras — each one adds depth to the speech. All can
                  be skipped.
                </p>

                {/* QA — Thread */}
                <div>
                  <FieldLabel hint="A way of approaching things, a habit, something consistent from childhood to today.">
                    {"Is there something "}
                    {daughterName}
                    {" does now that she’s always done?"}
                  </FieldLabel>
                  {skippedFields.has("thread") ? (
                    <SkippedBadge onUnskip={() => unskipField("thread")} />
                  ) : (
                    <>
                      <TextArea
                        rows={3}
                        placeholder="e.g. She always made lists. Even at seven. The lists got more detailed but they never stopped."
                        {...register("thread")}
                      />
                      <div className="mt-2">
                        <SkipButton onSkip={() => skipField("thread")} />
                      </div>
                    </>
                  )}
                </div>

                {/* QB — Surprise */}
                <div>
                  <FieldLabel>
                    {"What has surprised you most about who "}
                    {daughterName}
                    {" has become?"}
                  </FieldLabel>
                  {skippedFields.has("surprise") ? (
                    <SkippedBadge onUnskip={() => unskipField("surprise")} />
                  ) : (
                    <>
                      <TextArea
                        rows={3}
                        placeholder="e.g. How patient she is with people. I didn't see that coming."
                        {...register("surprise")}
                      />
                      <div className="mt-2">
                        <SkipButton onSkip={() => skipField("surprise")} />
                      </div>
                    </>
                  )}
                </div>

                {/* QC — Relationship */}
                <div>
                  <FieldLabel>
                    {"How would you describe your relationship with "}
                    {daughterName}
                    {" in one sentence?"}
                  </FieldLabel>
                  {skippedFields.has("relationship") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("relationship")}
                    />
                  ) : (
                    <>
                      <TextInput
                        placeholder="e.g. We don't always say much, but we understand each other."
                        {...register("relationship")}
                      />
                      <div className="mt-2">
                        <SkipButton onSkip={() => skipField("relationship")} />
                      </div>
                    </>
                  )}
                </div>

                {/* QD — What she'd say */}
                <div>
                  <FieldLabel>
                    {"If "}
                    {daughterName}
                    {" were giving this speech about you — what would she say?"}
                  </FieldLabel>
                  {skippedFields.has("what_shed_say") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("what_shed_say")}
                    />
                  ) : (
                    <>
                      <TextArea
                        rows={3}
                        placeholder="e.g. She'd say I'm stubborn, that I never ask for directions, and that I cry at adverts. All true."
                        {...register("what_shed_say")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("what_shed_say")}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* QE — Unsaid */}
                <div>
                  <FieldLabel>
                    {"Is there something you’ve never quite said to "}
                    {daughterName}
                    {" that you’d like to say today?"}
                  </FieldLabel>
                  {skippedFields.has("unsaid") ? (
                    <SkippedBadge onUnskip={() => unskipField("unsaid")} />
                  ) : (
                    <>
                      <TextArea
                        rows={3}
                        placeholder="e.g. That I've always admired how she handles things quietly, without making a fuss."
                        {...register("unsaid")}
                      />
                      <div className="mt-2">
                        <SkipButton onSkip={() => skipField("unsaid")} />
                      </div>
                    </>
                  )}
                </div>

                {/* QF — Partner timeline */}
                <div>
                  <FieldLabel>
                    {"How long have "}
                    {daughterName}
                    {" and "}
                    {partnerName}
                    {" been together, and when did you know "}
                    {partnerName}
                    {" was serious about her?"}
                  </FieldLabel>
                  {skippedFields.has("partner_timeline") ? (
                    <SkippedBadge
                      onUnskip={() => unskipField("partner_timeline")}
                    />
                  ) : (
                    <>
                      <TextInput
                        placeholder="e.g. Four years. I knew after about three months — he came to a family dinner and just got on with it."
                        {...register("partner_timeline")}
                      />
                      <div className="mt-2">
                        <SkipButton
                          onSkip={() => skipField("partner_timeline")}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {unansweredError && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  Please answer each question or skip it to continue.
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-md border border-border py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 6: Email + review + submit ── */}
          {step === 6 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Almost there.
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your email and review what you&apos;ve told us.
              </p>

              {/* Email */}
              <div className="mb-8">
                <FieldLabel
                  required
                  hint="We'll send your four speech drafts here. Valid for 7 days."
                >
                  Where should we send the speeches?
                </FieldLabel>
                <TextInput
                  type="email"
                  placeholder="your@email.com"
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Review summary */}
              <div className="rounded-md border border-border p-4 space-y-3 mb-8">
                <h2 className="text-sm font-semibold text-foreground">
                  Your answers
                </h2>
                {[
                  ["Father's name", getValues("father_name")],
                  ["Daughter's name", getValues("daughter_name")],
                  ["Partner's name", getValues("partner_name")],
                  ["Tone", getValues("tone")],
                  ["Length", getValues("length")],
                  ["Profession", getValues("profession")],
                  ["Three words", getValues("three_words")],
                  ["A quality of hers", getValues("memory_quality")],
                  ["A specific memory", getValues("memory_scene")],
                  ["About the partner", getValues("partner_observation")],
                  ["Closing line", getValues("end_line")],
                  ["How you feel about speaking", getValues("speaker_feeling")],
                  ["Avoid", getValues("avoid")],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="flex gap-3">
                      <span className="text-xs text-muted-foreground w-36 shrink-0 pt-0.5">
                        {label}
                      </span>
                      <span className="text-sm text-foreground line-clamp-2">
                        {value}
                      </span>
                    </div>
                  ) : null
                )}
              </div>

              {/* Pricing + submit */}
              <div className="rounded-md bg-muted p-4 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    Four speech drafts
                  </span>
                  <span className="text-sm font-semibold">£29</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes 5 free regenerations per archetype. Delivered by
                  email within a few minutes.
                </p>
              </div>

              {submitError && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={submitting}
                  className="flex-1 rounded-md border border-border py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-md bg-foreground text-background py-3 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    "Pay £29 →"
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Secure payment via Stripe. No card details stored.
              </p>
            </div>
          )}
        </form>

        {/* Skip review modal */}
        {showSkipReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">
                You&apos;ve skipped{" "}
                {skippedFields.size === 1
                  ? "1 question"
                  : `${skippedFields.size} questions`}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                The speeches will still be generated — but skipped questions
                won&apos;t be included. The more you share, the better the
                result.
              </p>
              <div className="space-y-1.5 mb-6">
                {Array.from(skippedFields).map((field) => (
                  <div
                    key={field}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    {FIELD_LABELS[field] ?? field}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSkipReview(false)}
                  className="flex-1 rounded-md border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Go back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSkipReview(false);
                    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
                  }}
                  className="flex-1 rounded-md bg-foreground text-background py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
