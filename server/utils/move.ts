export async function swapSort(model: any, data1: any, data2: any) {
  await model.update({
    where: {
      id: data2.id,
    },
    data: {
      sort: data1.sort,
    },
  });
  return await model.update({
    where: {
      id: data1.id,
    },
    data: {
      sort: data2.sort,
    },
  });
}

export async function moveUp(model: any, id: number) {
  const data = await model.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    throw createError({
      status: 404,
      message: "Not found",
    });
  }

  const previousData = await model.findFirst({
    where: { sort: { lt: data.sort } },
    orderBy: {
      sort: "desc",
    },
  });
  if (!previousData) {
    throw createError({
      status: 400,
      message: "No Data to move up.",
    });
  }

  return await swapSort(model, data, previousData);
}

export async function moveDown(model: any, id: number) {
  const data = await model.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    throw createError({
      status: 404,
      message: "Not found",
    });
  }

  const nextData = await model.findFirst({
    where: { sort: { gt: data.sort } },
    orderBy: {
      sort: "asc",
    },
  });

  if (!nextData) {
    throw createError({
      status: 400,
      message: "No Data to move down.",
    });
  }

  return await swapSort(model, data, nextData);
}

export async function moveToTop(model: any, id: number) {
  const data = await model.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    throw createError({
      status: 404,
      message: "Not found",
    });
  }
  const topData = await model.findFirst({
    orderBy: { sort: "asc" },
  });

  if (topData.id === data.id) {
    throw createError({
      status: 400,
      message: "No Data to move top.",
    });
  }

  await model.updateMany({
    where: { sort: { lt: data.sort } },
    data: {
      sort: {
        increment: 1,
      },
    },
  });

  return model.update({
    where: { id: data.id },
    data: {
      sort: topData.sort,
    },
  });
}

export async function moveToBottom(model: any, id: number) {
  const data = await model.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    throw createError({
      status: 404,
      message: "Not found",
    });
  }
  const bottomData = await model.findFirst({
    orderBy: { sort: "desc" },
  });
  if (bottomData.id === data.id) {
    throw createError({
      status: 400,
      message: "No Data to move bottom.",
    });
  }

  await model.updateMany({
    where: { sort: { gt: data.sort } },
    data: {
      sort: {
        decrement: 1,
      },
    },
  });

  return model.update({
    where: { id: data.id },
    data: {
      sort: bottomData.sort,
    },
  });
}
