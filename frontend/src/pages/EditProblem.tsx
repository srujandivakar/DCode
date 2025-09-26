import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Code2,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { Toast, ToastSuccess, ToastError } from "@/utils/ToastContainers";
import type {
  CreateProblemFormValues,
  Languages,
  ToggleLangFn,
} from "@/types/createProblem/createProblemTypes";
import { CreateProblemSchema } from "@/utils/ZodResolver";
import API from "@/utils/AxiosInstance";
import { ClipLoader } from "react-spinners";

const EditProblemForm = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expandedLang, setExpandedLang] = useState<
    Partial<Record<keyof Languages, boolean>>
  >({});

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProblemFormValues>({
    resolver: CreateProblemSchema,
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      tags: "",
      constraints: "",
      hints: "",
      editorial: "",
      examples: [{ input: "", output: "", explanation: "" }],
      testcases: [{ input: "", output: "" }],
      languages: {
        JAVASCRIPT: {
          starterCode: "",
          referenceSolution: ""
        },
        PYTHON: {
          starterCode: "",
          referenceSolution: ""
        },
        JAVA: {
          starterCode: "",
          referenceSolution: ""
        },
        CPP: {
          starterCode: "",
          referenceSolution: ""
        }
      }
    }
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: examplesFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control,
    name: "examples",
  });

  // Fetch existing problem data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) {
        ToastError("Problem ID is required");
        navigate("/problemset");
        return;
      }

      try {
        const response = await API.get(`/problem/${problemId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          const problemData = response.data.data;
          
          // Pre-populate form with existing data
          setValue("title", problemData.title || "");
          setValue("description", problemData.description || "");
          setValue("difficulty", problemData.difficulty || "");
          setValue("tags", Array.isArray(problemData.tags) ? problemData.tags.join(", ") : "");
          setValue("constraints", problemData.constraints || "");
          setValue("hints", problemData.hints || "");
          setValue("editorial", problemData.editorial || "");

          // Set examples
          if (problemData.examples && problemData.examples.length > 0) {
            reset((prevValues) => ({
              ...prevValues,
              examples: problemData.examples
            }));
          }

          // Set test cases
          if (problemData.testcases && problemData.testcases.length > 0) {
            reset((prevValues) => ({
              ...prevValues,
              testcases: problemData.testcases
            }));
          }

          // Set code snippets and reference solutions
          if (problemData.codeSnippets || problemData.referenceSolutions) {
            const languages = ["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as const;
            
            languages.forEach(lang => {
              setValue(`languages.${lang}.starterCode`, problemData.codeSnippets?.[lang] || "");
              setValue(`languages.${lang}.referenceSolution`, problemData.referenceSolutions?.[lang] || "");
            });
          }
        }
      } catch (error: any) {
        console.error("Error fetching problem:", error);
        ToastError(error?.response?.data?.error || "Failed to fetch problem data");
        navigate("/problemset");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId, setValue, reset, navigate]);

  const toggleLang: ToggleLangFn = (lang) => {
    setExpandedLang((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const onSubmit = async (data: CreateProblemFormValues) => {
    if (typeof data.tags === "string") {
      data.tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    // Ensure constraints and hints are strings
    const constraints = typeof data.constraints === 'string' ? data.constraints : '';
    const hints = typeof data.hints === 'string' ? data.hints : '';

    // Build codeSnippets and referenceSolutions dynamically
    const codeSnippets: Record<string, string> = {};
    const referenceSolutions: Record<string, string> = {};
    
    const languageKeys = ["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as const;
    
    languageKeys.forEach(lang => {
      const starterCode = data.languages?.[lang]?.starterCode;
      const referenceSolution = data.languages?.[lang]?.referenceSolution;
      
      // Only include languages that have reference solutions (required for validation)
      if (referenceSolution && referenceSolution.trim() !== "") {
        codeSnippets[lang] = starterCode || "";
        referenceSolutions[lang] = referenceSolution;
      }
    });

    // Ensure at least one language is provided
    if (Object.keys(referenceSolutions).length === 0) {
      ToastError("Please provide at least one reference solution for validation.");
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      tags: data.tags,
      examples: data.examples,
      constraints,
      hints,
      testcases: data.testcases,
      codeSnippets,
      referenceSolutions,
      editorial: data.editorial,
    };

    console.log('Updating problem data:', payload);

    try {
      const response = await API.put(
        `/problem/${problemId}/update`,
        payload,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        ToastSuccess(response.data.message || "Problem updated successfully");
        navigate("/problemset");
      }
    } catch (error: any) {
      console.error("Problem update failed:", error);
      ToastError(error?.response?.data?.error || "Failed to update problem");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} color="#4F46E5" />
      </div>
    );
  }

  return (
    <>
      <Toast />
      <div className="max-w-5xl mx-auto p-8 text-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#131212] rounded-2xl shadow-md p-8 space-y-10 shadow-neutral-800 border border-neutral-800"
        >
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <FileText className="w-6 h-6 text-blue-500" />
            Edit Problem
          </h1>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-xl">Title</Label>
            <Input
              {...register("title")}
              className="bg-zinc-900 text-white border border-gray-500"
              placeholder="Enter Problem Title"
            />
            {errors?.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-xl">Description</Label>
            <Textarea
              {...register("description")}
              rows={6}
              className="bg-zinc-900 text-white border border-gray-500 resize-y"
              placeholder="Problem description with examples and input/output formats"
            />
            {errors?.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Difficulty & Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300 text-xl">Difficulty</Label>
              <Select onValueChange={(value) => setValue("difficulty", value)}>
                <SelectTrigger className="bg-zinc-900 text-white border border-gray-500">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white border-gray-500">
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
              {errors?.difficulty && (
                <p className="text-red-500">{errors.difficulty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-xl">Tags</Label>
              <Input
                {...register("tags")}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="array, string, sorting (comma separated)"
              />
              {errors?.tags && (
                <p className="text-red-500">{errors.tags.message}</p>
              )}
            </div>
          </div>

          {/* Examples Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-xl">Examples</Label>
              <Button
                type="button"
                onClick={() =>
                  appendExample({ input: "", output: "", explanation: "" })
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Example
              </Button>
            </div>

            {examplesFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-600"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Example {index + 1}
                  </h3>
                  {examplesFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300">Input</Label>
                    <Textarea
                      {...register(`examples.${index}.input`)}
                      rows={3}
                      className="bg-zinc-900 text-white border border-gray-500"
                      placeholder="Example input"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Output</Label>
                    <Textarea
                      {...register(`examples.${index}.output`)}
                      rows={3}
                      className="bg-zinc-900 text-white border border-gray-500"
                      placeholder="Expected output"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Explanation (Optional)</Label>
                    <Textarea
                      {...register(`examples.${index}.explanation`)}
                      rows={2}
                      className="bg-zinc-900 text-white border border-gray-500"
                      placeholder="Explanation of the example"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-xl">Constraints</Label>
            <Textarea
              {...register("constraints")}
              rows={4}
              className="bg-zinc-900 text-white border border-gray-500"
              placeholder="• 1 ≤ n ≤ 10^5&#10;• 1 ≤ arr[i] ≤ 10^9"
            />
            {errors?.constraints && (
              <p className="text-red-500">{errors.constraints.message}</p>
            )}
          </div>

          {/* Test Cases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-xl">Test Cases</Label>
              <Button
                type="button"
                onClick={() => appendTestCase({ input: "", output: "" })}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test Case
              </Button>
            </div>

            {testCaseFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-600"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Test Case {index + 1}
                  </h3>
                  {testCaseFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Input</Label>
                    <Textarea
                      {...register(`testcases.${index}.input`)}
                      rows={4}
                      className="bg-zinc-900 text-white border border-gray-500"
                      placeholder="Test case input"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Expected Output</Label>
                    <Textarea
                      {...register(`testcases.${index}.output`)}
                      rows={4}
                      className="bg-zinc-900 text-white border border-gray-500"
                      placeholder="Expected output"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Templates & Solutions */}
          <div className="space-y-4">
            <Label className="text-gray-300 text-xl flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Code Templates & Reference Solutions
            </Label>

            {(
              ["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as Array<keyof Languages>
            ).map((lang) => (
              <div
                key={lang}
                className="bg-gray-800 rounded-lg border border-gray-600"
              >
                <button
                  type="button"
                  onClick={() => toggleLang(lang)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-700 hover:bg-gray-600 rounded-t-lg transition-colors"
                >
                  <span className="text-white font-medium">{lang}</span>
                  {expandedLang[lang] ? (
                    <ChevronUp className="w-5 h-5 text-gray-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-300" />
                  )}
                </button>

                {expandedLang[lang] && (
                  <div className="p-4 space-y-4">
                    <div>
                      <Label className="text-gray-300 text-sm mb-2 block">
                        Starter Code Template (shown to users)
                      </Label>
                      <div className="border border-gray-600 rounded">
                        <Editor
                          height="200px"
                          language={
                            lang === "CPP"
                              ? "cpp"
                              : lang === "JAVASCRIPT"
                              ? "javascript"
                              : lang.toLowerCase()
                          }
                          theme="vs-dark"
                          onChange={(value) =>
                            setValue(`languages.${lang}.starterCode`, value || "")
                          }
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 text-sm mb-2 block">
                        Reference Solution (for validation) *
                      </Label>
                      <div className="border border-gray-600 rounded">
                        <Editor
                          height="200px"
                          language={
                            lang === "CPP"
                              ? "cpp"
                              : lang === "JAVASCRIPT"
                              ? "javascript"
                              : lang.toLowerCase()
                          }
                          theme="vs-dark"
                          onChange={(value) =>
                            setValue(
                              `languages.${lang}.referenceSolution`,
                              value || ""
                            )
                          }
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Editorial & Hints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300 text-xl">Hints (Optional)</Label>
              <Textarea
                {...register("hints")}
                rows={4}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="Helpful hints for solving the problem"
              />
              {errors?.hints && (
                <p className="text-red-500">{errors.hints.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-xl">Editorial (Optional)</Label>
              <Textarea
                {...register("editorial")}
                rows={4}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="Detailed explanation of the solution approach"
              />
              {errors?.editorial && (
                <p className="text-red-500">{errors.editorial.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate("/problemset")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Problem
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProblemForm;