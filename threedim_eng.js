/**
 * The MIT License (MIT)
 * Copyright (c) 2016 Alcanderian
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

var t_animate = (function () {
    var last_time = 0;
    var vendors = ['webkit', 'moz'];
    window.t_request_animate = window.requestAnimationFrame;
    window.t_cancel_animate = window.cancelAnimationFrame;
    for (var x = 0; x < vendors.length && !window.t_request_animate; ++x) {
        window.t_request_animate = window[vendors[x] + 'RequestAnimationFrame'];
        window.t_cancel_animate = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.t_request_animate) {
        window.t_request_animate = function (callback,
                                             element) {
            var current_time = new Date().getTime();
            var time_to_call = Math.max(
                0,
                16.7 - (current_time - last_time));
            var id = window.setTimeout(function () {
                    callback(current_time + time_to_call);
                },
                time_to_call);
            last_time = current_time + time_to_call;
            return id;
        };
    }
    if (!window.t_cancel_animate) {
        window.t_cancel_animate = function (id) {
            clearTimeout(id);
        };
    }
}());

var t_rand = function (number) {
    var base_rand = function base_rand() {
        this.today = new Date();
        this.seed = this.today.getTime();
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / (233280.0);
    };

    var rand = function (number) {
        return Math.ceil(base_rand() * number);
    };

    return rand(number);
};

var t_z_sort = function (arr, cmp_func) {
    var compare = cmp_func || (function (a, b) {
            return a.z < b.z;
        });

    var swap = function (arr, a, b) {
        var temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    };

    var partition = function (arr, low, high) {
        while (low < high) {
            while (high > low && !compare(arr[high], arr[low])) {
                --high;
            }
            while (low < high && compare(arr[low], arr[high])) {
                ++low;
            }
            swap(arr, low, high--);
        }
        return low;
    };

    var q_sort = function (arr, low, high) {
        if (low >= high) {
            return arr;
        }
        var pivot = partition(arr, low, high);
        q_sort(arr, low, pivot - 1);
        q_sort(arr, pivot + 1, high);
        return arr;
    };

    return q_sort(arr, 0, arr.length - 1);
};

var t_in_surface = function (pt_p, sf_poly) {
    var px = pt_p.x, py = pt_p.y, flag = false;
    for (var i = 0, l = sf_poly.proj_vertex.length, j = l - 1; i < l; j = i, i++) {
        var sx = sf_poly.proj_vertex[i].x, sy = sf_poly.proj_vertex[i].y;
        var tx = sf_poly.proj_vertex[j].x, ty = sf_poly.proj_vertex[j].y;

        if ((sx === px && sy === py) || (tx === px && ty === py)) return false;
        if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
            var x = sx + (py - sy) * (tx - sx) / (ty - sy);
            if (x === px) return false;
            if (x > px) flag = !flag;
        }
    }
    return flag;
};

var t_get_vector_angle = function (pt_vector_a, pt_vector_b) {
    var dot = t_mtrx_cross(
        pt_vector_a.get_row(),
        pt_vector_b.get_col());
    var mod = Math.sqrt(
            t_mtrx_cross(
                pt_vector_a.get_row(),
                pt_vector_a.get_col())[0][0]) * Math.sqrt(
            t_mtrx_cross(
                pt_vector_b.get_row(),
                pt_vector_b.get_col())[0][0]);
    return t_rad_to_deg(Math.acos(dot[0][0] / mod));
};

var t_pt_add = function (pt_a,
                         pt_b) {
    return new t_point(
        pt_a.x + pt_b.x,
        pt_a.y + pt_b.y,
        pt_a.z + pt_b.z);
};

var t_pt_sub = function (pt_a,
                         pt_b) {
    return new t_point(
        pt_a.x - pt_b.x,
        pt_a.y - pt_b.y,
        pt_a.z - pt_b.z);
};

var t_mtrx_i = function () {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
};

var t_mtrx_cross = function (mtrx_a,
                             mtrx_b) {
    var row_a = mtrx_a.length || 0;
    var col_a = mtrx_a[0].length || 0;
    var row_b = mtrx_b.length || 0;
    var col_b = mtrx_b[0].length || 0;

    if (col_a !== row_b) return undefined;

    var mtrx_ret = [];
    for (var i = 0; i < row_a; ++i) {
        mtrx_ret[i] = [];
        for (var j = 0; j < col_b; ++j) {
            mtrx_ret[i][j] = 0;
        }
    }

    for (var i = 0; i < row_a; ++i) {
        for (var k = 0; k < row_b; ++k) {
            for (var j = 0; j < col_b; ++j) {
                mtrx_ret[i][j] += mtrx_a[i][k] * mtrx_b[k][j];
            }
        }
    }
    return mtrx_ret;
};

var t_mtrx_add = function (mtrx_a,
                           mtrx_b) {
    var row = mtrx_a.length || 0;
    var col = mtrx_a[0].length || 0;

    var mtrx_ret = [];
    for (var i = 0; i < row; ++i) {
        mtrx_ret[i] = [];
        for (var j = 0; j < col; ++j) {
            mtrx_ret[i][j] = 0;
        }
    }

    for (var i = 0; i < row; ++i) {
        for (var j = 0; j < col; ++j) {
            mtrx_ret[i][j] += mtrx_a[i][j] + mtrx_b[i][j];
        }
    }
    return mtrx_ret;
};

var t_mtrx_sub = function (mtrx_a,
                           mtrx_b) {
    var row = mtrx_a.length || 0;
    var col = mtrx_a[0].length || 0;

    var mtrx_ret = [];
    for (var i = 0; i < row; ++i) {
        mtrx_ret[i] = [];
        for (var j = 0; j < col; ++j) {
            mtrx_ret[i][j] = 0;
        }
    }

    for (var i = 0; i < row; ++i) {
        for (var j = 0; j < col; ++j) {
            mtrx_ret[i][j] += mtrx_a[i][j] - mtrx_b[i][j];
        }
    }
    return mtrx_ret;
};

var t_sin = function (num) {
    return Math.sin(num);
};

var t_cos = function (num) {
    return Math.cos(num);
};

var t_tan = function (num) {
    return Math.tan(num);
};

var t_cot = function (num) {
    return 1 / Math.tan(num);
};

var t_get_project_mtrx = function (pt_xita) {
    var mtrx_ret = t_mtrx_cross(
        [
            [1, 0, 0],
            [0, t_cos(-pt_xita.x), -t_sin(-pt_xita.x)],
            [0, t_sin(-pt_xita.x), t_cos(-pt_xita.x)]
        ],
        [
            [t_cos(-pt_xita.y), 0, t_sin(-pt_xita.y)],
            [0, 1, 0],
            [-t_sin(-pt_xita.y), 0, t_cos(-pt_xita.y)]
        ]);
    mtrx_ret = t_mtrx_cross(
        mtrx_ret,
        [
            [t_cos(-pt_xita.z), -t_sin(-pt_xita.z), 0],
            [t_sin(-pt_xita.z), t_cos(-pt_xita.z), 0],
            [0, 0, 1]
        ]);
    return mtrx_ret;
};

var t_get_rot_mtrx = function (pt_xita) {
    var mtrx_ret = t_mtrx_cross(
        [
            [1, 0, 0],
            [0, t_cos(pt_xita.x), -t_sin(pt_xita.x)],
            [0, t_sin(pt_xita.x), t_cos(pt_xita.x)]
        ],
        [
            [t_cos(pt_xita.y), 0, t_sin(pt_xita.y)],
            [0, 1, 0],
            [-t_sin(pt_xita.y), 0, t_cos(pt_xita.y)]
        ]);
    mtrx_ret = t_mtrx_cross(
        mtrx_ret,
        [
            [t_cos(pt_xita.z), -t_sin(pt_xita.z), 0],
            [t_sin(pt_xita.z), t_cos(pt_xita.z), 0],
            [0, 0, 1]
        ]);
    return mtrx_ret;
};

var t_cam_project_by_xita = function (pt_a,
                                      pt_c,
                                      pt_xita,
                                      pt_e) {
    return t_cam_project_by_mtrx(
        pt_a,
        pt_c,
        t_get_project_mtrx(pt_xita),
        pt_e);
};

var t_cam_project_by_mtrx = function (pt_a,
                                      pt_c,
                                      mtrx_proj,
                                      pt_e) {
    var mtrx_distance = mtrx_proj;
    mtrx_distance = t_mtrx_cross(
        mtrx_distance,
        t_mtrx_sub(
            pt_a.get_col(),
            pt_c.get_col()
        ));

    var mtrx_focus = t_mtrx_cross(
        [
            [1, 0, 0, -pt_e.x],
            [0, 1, 0, -pt_e.y],
            [0, 0, 1, 0],
            [0, 0, 1 / pt_e.z, 0]
        ],
        [
            mtrx_distance[0],
            mtrx_distance[1],
            mtrx_distance[2],
            [1]
        ]);
    var pt_ret = new t_point(
        mtrx_focus[0][0] / mtrx_focus[3][0],
        mtrx_focus[1][0] / mtrx_focus[3][0],
        pt_a.z);
    return pt_ret;
};

var t_deg_to_rad = function (num) {
    return Math.PI * num / 180;
};

var t_rad_to_deg = function (num) {
    return 180 * num / Math.PI;
};

var t_view_distance = function (num) {
    var ret = 1000 / num;
    if (ret === 1 / 0) ret = 0;
    return ret;
};

var t_cam_distance = function (num) {
    return 30 * num || 0;
};

var t_set_fps = function (num) {
    return 1000 / num || 0;
};

var t_point = function (x,
                        y,
                        z) {
    this.type_name_const = "t_point";
    this.obj_name = "";
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    this.reset_point = function (x,
                                 y,
                                 z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };

    this.get_col = function () {
        return [[this.x], [this.y], [this.z]];
    };

    this.get_row = function () {
        return [[this.x, this.y, this.z]];
    };

    this.translate_by_vector = function (pt_vtr) {
        this.x += pt_vtr.x;
        this.y += pt_vtr.y;
        this.z += pt_vtr.z;
    };
};

var t_surface = function (vertex_num,
                          vtxs) {
    this.type_name_const = "t_surface";
    this.obj_name = "";
    this.vertex = [];
    this.proj_vertex = [];
    this.size = vertex_num || 0;
    this.color = "#000";
    this.cam_pos = new t_point(
        0,
        0,
        0);
    this.cam_xita = new t_point(
        0,
        0,
        0);
    this.cam_mtrx = t_mtrx_i();
    this.view_pos = new t_point(
        0,
        0,
        0);
    this.z = 0;

    this.z_center = function () {
        this.z = 0;
        for (var i = 0; i < this.size; ++i) {
            this.z += this.vertex[i].z;
        }
        this.z /= this.size;
    };

    this.translate_by_vector = function (pt_vtr) {
        for (var i = 0; i < this.size; ++i) {
            this.vertex[i].translate_by_vector(pt_vtr);
        }
        this.z += pt_vtr.z;
    };

    this.reset_surface = function (vertex_num,
                                   vtxs) {
        this.size = vertex_num || 0;
        for (var i = 1; i <= this.size; ++i) {
            this.vertex[i - 1] = arguments[i] || 0;
        }
        this.z_center();
    };

    this.reset_vertex = function (index, pt_vtx) {
        this.vertex[index] = pt_vtx;
    };

    this.set_color = function (color) {
        this.color = color;
    };

    this.set_cam_pos = function (pt_cam_pos) {
        this.cam_pos = pt_cam_pos;
    };

    this.set_cam_xita = function (pt_xita) {
        this.cam_xita = pt_xita;
        this.cam_mtrx = t_get_project_mtrx(this.cam_xita);
    };

    this.set_cam_mtrx = function (mtrx_cam) {
        this.cam_mtrx = mtrx_cam;
    };

    this.set_view_pos = function (pt_view_pos) {
        this.view_pos = pt_view_pos;
    };

    this.rot_by_xita = function (pt_xita) {
        this.rot_by_mtrx(t_get_rot_mtrx(pt_xita));
    };

    this.rot_by_mtrx = function (mtrx_rot) {
        for (var i = 0; i < this.size; ++i) {
            var vtr_tmp = t_mtrx_cross(mtrx_rot, this.vertex[i].get_col());
            this.vertex[i].reset_point(
                vtr_tmp[0][0],
                vtr_tmp[1][0],
                vtr_tmp[2][0]);
        }
        this.z_center();
    };

    this.project_by_xita = function (pt_xita) {
        var pt_tmp = this.cam_xita;
        if (pt_xita) pt_tmp = pt_xita;

        this.project_by_mtrx(t_get_project_mtrx(pt_tmp));
    };

    this.project_by_mtrx = function (mtrx_proj) {
        var mtrx_tmp = this.cam_mtrx;
        if (mtrx_proj) mtrx_tmp = mtrx_proj;

        for (var i = 0; i < this.size; ++i) {
            this.proj_vertex[i] = t_cam_project_by_mtrx(
                this.vertex[i],
                this.cam_pos,
                mtrx_tmp,
                this.view_pos);
        }
    };

    this.render = function (canvas_id,
                            border,
                            color) {
        var canvas = document.getElementById(canvas_id);
        var context = canvas.getContext("2d");
        var fstyle = context.fillStyle;

        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(this.proj_vertex[0].x, this.proj_vertex[0].y);
        for (var i = 1; i < this.size; ++i) {
            context.lineTo(this.proj_vertex[i].x, this.proj_vertex[i].y);
        }
        context.closePath();

        if (border) context.stroke();
        if (color && this.color) context.fill();

        context.fillStyle = fstyle;
    };

    for (var i = 1; i <= this.size; ++i) {
        this.vertex[i - 1] = arguments[i] || 0;
        if (i === this.size) this.z_center();
    }

};

var t_body = function (face_num,
                       facs) {
    this.type_name_const = "t_body";
    this.obj_name = "";
    this.face = [];
    this.sorted_face = [];
    this.size = face_num || 0;
    this.color = "#000";
    this.cam_pos = new t_point(
        0,
        0,
        0);
    this.cam_xita = new t_point(
        0,
        0,
        0);
    this.cam_mtrx = t_mtrx_i();
    this.view_pos = new t_point(
        0,
        0,
        0);
    this.z = 0;

    this.z_center = function () {
        this.z = 0;
        for (var i = 0; i < this.size; ++i) {
            this.z += this.face[i].z;
        }
        this.z /= this.size;
    };

    this.translate_by_vector = function (pt_vtr) {
        for (var i = 0; i < this.size; ++i) {
            this.face[i].translate_by_vector(pt_vtr);
        }
        this.z += pt_vtr.z;
    };

    this.reset_body = function (face_num,
                                facs) {
        this.size = face_num || 0;
        for (var i = 1; i <= this.size; ++i) {
            this.face[i - 1] = arguments[i] || 0;
            this.sorted_face[i - 1] = arguments[i] || 0;
        }
        this.z_center();
        t_z_sort(this.sorted_face);
    };

    this.reset_face = function (index, sf_fac) {
        this.face[index] = sf_fac;
        this.z_center();
        t_z_sort(this.sorted_face);
    };

    this.set_color = function (color) {
        this.color = color;
        for (var i = 0; i < this.size; ++i) {
            this.face[i].set_color(color);
        }
    };

    this.set_cam_pos = function (pt_cam_pos) {
        this.cam_pos = pt_cam_pos;
        for (var i = 0; i < this.size; ++i) {
            this.face[i].set_cam_pos(pt_cam_pos)
        }
    };

    this.set_cam_xita = function (pt_xita) {
        this.cam_xita = pt_xita;
        this.cam_mtrx = t_get_project_mtrx(this.cam_xita);
        for (var i = 0; i < this.size; ++i) {
            this.face[i].set_cam_xita(pt_xita);
        }
    };

    this.set_view_pos = function (pt_view_pos) {
        this.view_pos = pt_view_pos;
        for (var i = 0; i < this.size; ++i) {
            this.face[i].set_view_pos(pt_view_pos);
        }
    };

    this.rot_by_xita = function (pt_xita) {
        this.rot_by_mtrx(t_get_rot_mtrx(pt_xita));
    };

    this.rot_by_mtrx = function (mtrx_rot) {
        for (var i = 0; i < this.size; ++i) {
            this.face[i].rot_by_mtrx(mtrx_rot);
        }
        this.z_center();
        t_z_sort(this.sorted_face);
    };

    this.project_by_xita = function (pt_xita) {
        var pt_tmp = this.cam_xita;
        if (pt_xita) pt_tmp = pt_xita;

        this.project_by_mtrx(t_get_project_mtrx(pt_tmp));
    };

    this.project_by_mtrx = function (mtrx_proj) {
        var mtrx_tmp = this.cam_mtrx;
        if (mtrx_proj) mtrx_tmp = mtrx_proj;

        for (var i = 0; i < this.size; ++i) {
            this.face[i].project_by_mtrx(mtrx_tmp);
        }
    };

    this.render = function (canvas_id,
                            border,
                            color) {
        for (var i = 0; i < this.size; ++i) {
            this.sorted_face[i].render(
                canvas_id,
                border,
                color);
        }
    };

    for (var i = 1; i <= this.size; ++i) {
        this.face[i - 1] = arguments[i] || 0;
        this.sorted_face[i - 1] = arguments[i] || 0;
        if (i === this.size) {
            this.z_center();
            t_z_sort(this.sorted_face);
        }
    }
};

var t_cube = function (pt_whd, pt_center_pos) {
    this.whd = pt_whd;
    this.center_pos = pt_center_pos;
    this.front = new t_surface(0);
    this.back = new t_surface(0);
    this.left = new t_surface(0);
    this.right = new t_surface(0);
    this.up = new t_surface(0);
    this.down = new t_surface(0);

    this.build_face = function () {
        this.front.reset_surface(
            4,
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2));
        this.back.reset_surface(
            4,
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2));
        this.left.reset_surface(
            4,
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2));
        this.right.reset_surface(
            4,
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2));
        this.up.reset_surface(
            4,
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y + this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2));
        this.down.reset_surface(
            4,
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z + this.whd.z / 2),
            new t_point(
                this.center_pos.x + this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2),
            new t_point(
                this.center_pos.x - this.whd.x / 2,
                this.center_pos.y - this.whd.y / 2,
                this.center_pos.z - this.whd.z / 2));
    };

    this.reset_cube = function (pt_whd) {
        this.whd = pt_whd;
        this.build_face();
    };

    this.set_center_pos = function (pt_pos) {
        this.center_pos = pt_pos;
        this.build_face();
    };

    this.build_face();

    t_body.call(
        this,
        6,
        this.front,
        this.back,
        this.left,
        this.right,
        this.up,
        this.down);
};