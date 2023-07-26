import { setupAppDtoSchema } from "../../../dto/setup.dto";
import { hash } from "ohash";
export default defineApi(async (event) => {
  const prisma = usePrisma();
  const existingRecord = await prisma.group.findUnique({
    where: {
      code: "public",
    },
  });
  const error = createError({
    status: 409,
    message: "App is already setup",
  });
  if (existingRecord) {
    throw error;
  }
  const body = await readBody(event);
  const { username, password, repassword, ...bodyData } =
    setupAppDtoSchema.parse(body);
  const userCount = await prisma.user.count();
  if (userCount !== 0) {
    throw error;
  }
  await prisma.user.create({
    data: {
      username,
      password: hash(password),
    },
  });
  try {
    return await prisma.group.create({
      data: {
        code: "public",
        name: "公共",
        categories: {
          create: {
            name: "Setup",
            sites: {
              create: {
                site: {
                  create: {
                    name: bodyData.name,
                    urls: {
                      create: {
                        link: bodyData.url,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw error;
  }
});
