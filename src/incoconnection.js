import dummyData from './dummy_data.json';

let NOHARDWARE = true;

let session = null;

export async function incoconnect(url) {
    if (NOHARDWARE) {
        console.log("run in nohardware mode");
        return;
    }

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
    if (NOHARDWARE) {
        return;
    }

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
    if (NOHARDWARE) {
        ret = dummyData;
        for (const key in ret) {
            ret[key] += Math.floor(Math.random() * 100);
        }
        return ret;
    }

    var ret = new Object();
    if (!session) {
        console.log("INCO V Session not open");
        return ret;
    }

    try {
        const partitions = await session.getTree(
            "Target.Memory.Pools.Heap.Partitions",
        );
        for (const [key, value] of Object.entries(partitions.members)) {
            const classes = await session.getTree(
                "Target.Memory.Pools.Heap.Partitions." + key + ".Classes",
            );
            for (const [classKey, classValue] of Object.entries(classes.members,)) {
                if (classValue.value.value === "Count unavailable") {
                    continue;
                }
                if (classKey in ret) {
                    ret[classKey] += key * classValue.value.value;
                } else {
                    ret[classKey] = key * classValue.value.value;
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
    if (NOHARDWARE) {
        return Math.floor(Math.random() * 1000);
    }

    return await session.getVariable("Target.Memory.Pools.Heap.Size");
}

export async function incousedmem() {
    if (NOHARDWARE) {
        return Math.floor(Math.random() * 1000);
    }

    return await session.getVariable("Target.Memory.Pools.Heap.FreeSize");
}
