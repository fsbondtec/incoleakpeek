let session = null;

export async function incoconnect(url) {
    if (session) {
        console.log("INCO V Session already open");
        return;
    }

    try {
        session = await incov.createSession(url);
        console.log("Oida voi cool connected");
    } catch (error) {
        console.error("Creating INCOV session failed: " + error);
    }
}

export function incodisconnect() {
    if (session) {
        try {
            session.destroy();
            session = null;
        } catch (error) {
            console.error("Creating INCOV session failed: " + error);
        }
    }
}

export async function incoclassmemusage() {
    var ret = new Object();
    if (!session) {
        console.log("INCO V Session not open");
        return ret;
    }

    try {
        const partitions = await session.getTree("Target.Memory.Pools.Heap.Partitions");
        for (const [key, value] of Object.entries(partitions.members)) {
            const classes = await session.getTree("Target.Memory.Pools.Heap.Partitions." + key + ".Classes");
            for (const [classKey, classValue] of Object.entries(classes.members)) {
                if (classKey in ret) {
                    ret[classKey] += classValue.value.value;
                } else {
                    ret[classKey] = classValue.value.value;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching Heap Tree:", error);
    }

    console.log(ret);
    return ret;
}

export async function incototalmem() {
    return await session.getVariable("Target.Memory.Pools.Heap.Size");
}

export async function incousedmem() {
    return await session.getVariable("Target.Memory.Pools.Heap.FreeSize");
}
