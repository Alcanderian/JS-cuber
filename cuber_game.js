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

var t_base_cuber = function (len) {
    this.colored_faces = [];
    this.cubes = [];
    this.front = [];
    this.back = [];
    this.up = [];
    this.down = [];
    this.left = [];
    this.right = [];
    this.alpha = [];
    this.beta = [];
    this.gama = [];
    this.mtrx_rev_a = t_get_rot_mtrx(
        new t_point(
            t_deg_to_rad(-25),
            0,
            0));
    this.mtrx_rev_b = t_get_rot_mtrx(
        new t_point(
            0,
            t_deg_to_rad(-50),
            0));
    this.mtrx_forward = t_get_rot_mtrx(
        new t_point(
            t_deg_to_rad(25),
            t_deg_to_rad(50),
            0));

    this.init = function (len) {
        var deg = 3, cnt = 0;
        var cam_pos = new t_point(
            t_cam_distance(0),
            t_cam_distance(0),
            t_cam_distance(14));
        var cam_xita = new t_point(
            t_deg_to_rad(0),
            t_deg_to_rad(0),
            t_deg_to_rad(0));
        var view_pos = new t_point(
            t_view_distance(0),
            t_view_distance(0),
            t_view_distance(1.1));
        var mtrx_rot = t_get_rot_mtrx(
            new t_point(
                t_deg_to_rad(25),
                t_deg_to_rad(50),
                t_deg_to_rad(0)));

        for (var i = 0; i < deg; ++i) {
            for (var j = 0; j < deg; ++j) {
                for (var k = 0; k < deg; ++k) {
                    this.cubes[cnt] = new t_cube(
                        new t_point(
                            len,
                            len,
                            len),
                        new t_point(
                            len * (k - 1),
                            len * (j - 1),
                            -len * (i - 1)));
                    this.cubes[cnt].set_cam_pos(cam_pos);
                    this.cubes[cnt].set_cam_xita(cam_xita);
                    this.cubes[cnt].set_view_pos(view_pos);
                    this.cubes[cnt].rot_by_mtrx(mtrx_rot);
                    ++cnt;
                }
            }
        }

        for (var i = 0; i < 6; ++i) {
            this.colored_faces[i] = [];
        }
        var face_up = [6, 7, 8, 15, 16, 17, 24, 25, 26];
        var face_right = [2, 5, 8, 11, 14, 17, 20, 23, 26];
        var face_alpha = [1, 10, 19, 4, 13, 22, 7, 16, 25];
        var face_beta = [3, 4, 5, 12, 13, 14, 21, 22, 23];
        for (var i = 0; i < 9; ++i) {
            this.cubes[i].front.set_color("#F3F3F3");
            this.cubes[i + 18].back.set_color("#E87000");
            this.cubes[face_up[i]].up.set_color("#009D54");
            this.cubes[face_up[i] - 6].down.set_color("#3D81F6");
            this.cubes[face_right[i]].right.set_color("#F5B400");
            this.cubes[face_right[i] - 2].left.set_color("#DC422F");
            this.colored_faces[0][i] = this.cubes[i].front;
            this.colored_faces[1][i] = this.cubes[i + 18].back;
            this.colored_faces[2][i] = this.cubes[face_up[i]].up;
            this.colored_faces[3][i] = this.cubes[face_up[i] - 6].down;
            this.colored_faces[4][i] = this.cubes[face_right[i]].right;
            this.colored_faces[5][i] = this.cubes[face_right[i] - 2].left;
            this.front[i] = this.cubes[i];
            this.back[i] = this.cubes[i + 18];
            this.up[i] = this.cubes[face_up[i]];
            this.down[i] = this.cubes[face_up[i] - 6];
            this.left[i] = this.cubes[face_right[i]];
            this.right[i] = this.cubes[face_right[i] - 2];
            this.alpha[i] = this.cubes[face_alpha[i]];
            this.beta[i] = this.cubes[face_beta[i]];
            this.gama[i] = this.cubes[i + 9];
        }
    };

    this.render = function (canvas_id) {
        var queue = [];
        for (var i = 0; i < this.cubes.length; ++i) {
            for (var j = 0; j < this.cubes[i].face.length; ++j) {
                queue[i * 6 + j] = this.cubes[i].face[j];
            }
        }
        queue = t_z_sort(queue);
        for (var i = 0; i < queue.length; ++i) {
            queue[i].project_by_mtrx();
            queue[i].render(canvas_id, true, true);
        }
    };

    this.shell_render = function (canvas_id) {
        var queue = [];
        for (var i = 0; i < this.colored_faces.length; ++i) {
            for (var j = 0; j < this.colored_faces[i].length; ++j) {
                queue[i * this.colored_faces[i].length + j] = this.colored_faces[i][j];
            }
        }
        queue = t_z_sort(queue);
        for (var i = 0; i < queue.length; ++i) {
            queue[i].project_by_mtrx();
            queue[i].render(canvas_id, true, true);
        }
    };

    this.init(len);

    this.fixed_rot_by_xita = function (arr, pt_xita) {
        this.fixed_rot_by_mtrx(arr, t_get_rot_mtrx(pt_xita));
    };

    this.fixed_rot_by_mtrx = function (arr, mtrx_rot) {
        for (var i = 0; i < arr.length; ++i) {
            arr[i].rot_by_mtrx(this.mtrx_rev_a);
            arr[i].rot_by_mtrx(this.mtrx_rev_b);
            arr[i].rot_by_mtrx(mtrx_rot);
            arr[i].rot_by_mtrx(this.mtrx_forward);
        }
    };
};

var t_base_cuber_manager = function (len) {
    var base_cuber = new t_base_cuber(len);
    var has_rot = new t_point();

    this.get_has_rot = function () {
        return has_rot;
    };

    this.get_base_cuber = function () {
        return base_cuber;
    };

    var clock = function (arr) {
        var tmp = [];
        for (var i = 0; i < 9; ++i) {
            tmp[i] = arr[i];
        }
        for (var i = 0; i < 9; ++i) {
            arr[i] = tmp[8 - Math.floor(i / 3) - 3 * (2 - (i % 3))];
        }
    };

    var op_clock = function (arr) {
        var tmp = [];
        for (var i = 0; i < 9; ++i) {
            tmp[i] = arr[i];
        }
        for (var i = 0; i < 9; ++i) {
            arr[8 - Math.floor(i / 3) - 3 * (2 - (i % 3))] = tmp[i];
        }
    };

    var opposi_vtc = function (arr) {
        var a = arr[0], b = arr[1], c = arr[2];
        arr[0] = arr[6], arr[1] = arr[7], arr[2] = arr[8];
        arr[6] = a, arr[7] = b, arr[8] = c;
    };

    var opposi_land = function (arr) {
        var a = arr[0], b = arr[3], c = arr[6];
        arr[0] = arr[2], arr[3] = arr[5], arr[6] = arr[8];
        arr[2] = a, arr[5] = b, arr[8] = c;
    };

    var build_alpha_beta_gama = function () {
        base_cuber.alpha[0] = base_cuber.down[1];
        base_cuber.alpha[1] = base_cuber.down[4];
        base_cuber.alpha[2] = base_cuber.down[7];
        base_cuber.alpha[3] = base_cuber.front[4];
        base_cuber.alpha[4] = base_cuber.cubes[13];
        base_cuber.alpha[5] = base_cuber.back[4];
        base_cuber.alpha[6] = base_cuber.up[1];
        base_cuber.alpha[7] = base_cuber.up[4];
        base_cuber.alpha[8] = base_cuber.up[7];

        base_cuber.beta[0] = base_cuber.front[3];
        base_cuber.beta[1] = base_cuber.front[4];
        base_cuber.beta[2] = base_cuber.front[5];
        base_cuber.beta[3] = base_cuber.right[4];
        base_cuber.beta[4] = base_cuber.cubes[13];
        base_cuber.beta[5] = base_cuber.left[4];
        base_cuber.beta[6] = base_cuber.back[3];
        base_cuber.beta[7] = base_cuber.back[4];
        base_cuber.beta[8] = base_cuber.back[5];

        base_cuber.gama[0] = base_cuber.down[3];
        base_cuber.gama[1] = base_cuber.down[4];
        base_cuber.gama[2] = base_cuber.down[5];
        base_cuber.gama[3] = base_cuber.right[4];
        base_cuber.gama[4] = base_cuber.cubes[13];
        base_cuber.gama[5] = base_cuber.left[4];
        base_cuber.gama[6] = base_cuber.up[3];
        base_cuber.gama[7] = base_cuber.up[4];
        base_cuber.gama[8] = base_cuber.up[5];
    };

    this.auto_rot = [];

    for (var i = 0; i < 29; ++i) {
        this.auto_rot[i] = [];
    }

    /**
     * left_up, down
     */
    this.auto_rot[27][0] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (-90 - has_rot.x) / frm;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    t_deg_to_rad(remain),
                    0,
                    0));
            var animate_id;
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    has_rot.x = 0;
                    t_cancel_animate(animate_id);
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.front[i];
                    }

                    opposi_vtc(base_cuber.down);
                    base_cuber.front = base_cuber.down;

                    base_cuber.down = base_cuber.back;

                    opposi_vtc(base_cuber.up);
                    base_cuber.back = base_cuber.up;

                    base_cuber.up = tmp;

                    op_clock(base_cuber.right);
                    op_clock(base_cuber.left);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    this.auto_rot[27][1] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (90 - has_rot.x) / frm;
            var animate_id;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    t_deg_to_rad(remain),
                    0,
                    0));
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    t_cancel_animate(animate_id);
                    has_rot.x = 0;
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.front[i];
                    }

                    base_cuber.front = base_cuber.up;

                    opposi_vtc(base_cuber.back);
                    base_cuber.up = base_cuber.back;

                    base_cuber.back = base_cuber.down;

                    opposi_vtc(tmp);
                    base_cuber.down = tmp;

                    clock(base_cuber.right);
                    clock(base_cuber.left);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    /**
     * right_up, down
     */
    this.auto_rot[28][0] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (-90 - has_rot.z) / frm;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    0,
                    0,
                    t_deg_to_rad(remain)));
            var animate_id;
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    has_rot.z = 0;
                    t_cancel_animate(animate_id);
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.right[i];
                    }

                    opposi_land(base_cuber.down);
                    base_cuber.right = base_cuber.down;

                    base_cuber.down = base_cuber.left;

                    opposi_land(base_cuber.up);
                    base_cuber.left = base_cuber.up;

                    base_cuber.up = tmp;

                    clock(base_cuber.front);
                    clock(base_cuber.back);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    this.auto_rot[28][1] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (90 - has_rot.z) / frm;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    0,
                    0,
                    t_deg_to_rad(remain)));
            var animate_id;
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    has_rot.z = 0;
                    t_cancel_animate(animate_id);
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.right[i];
                    }

                    base_cuber.right = base_cuber.up;

                    opposi_land(base_cuber.left);
                    base_cuber.up = base_cuber.left;

                    base_cuber.left = base_cuber.down;

                    opposi_land(tmp);
                    base_cuber.down = tmp;

                    op_clock(base_cuber.front);
                    op_clock(base_cuber.back);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    /**
     * left, right
     */
    this.auto_rot[28][2] = this.auto_rot[27][2] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (90 - has_rot.y) / frm;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    0,
                    t_deg_to_rad(remain),
                    0));
            var animate_id;
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    t_cancel_animate(animate_id);
                    has_rot.y = 0;
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.front[i];
                    }

                    op_clock(base_cuber.right);
                    base_cuber.front = base_cuber.right;

                    opposi_vtc(base_cuber.back);
                    op_clock(base_cuber.back);
                    base_cuber.right = base_cuber.back;

                    op_clock(base_cuber.left);
                    base_cuber.back = base_cuber.left;

                    opposi_vtc(tmp);
                    op_clock(tmp);
                    base_cuber.left = tmp;

                    op_clock(base_cuber.down);
                    op_clock(base_cuber.up);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    this.auto_rot[28][3] = this.auto_rot[27][3] =
        function (canvas_id, quick) {
            var canvas = canvas_id, is_quick = quick || false;
            var context = document.getElementById(canvas).getContext("2d");
            var cnt = 0, frm = is_quick ? 1 : 10;
            var remain = (-90 - has_rot.y) / frm;
            var mtrx_rot = t_get_rot_mtrx(
                new t_point(
                    0,
                    t_deg_to_rad(remain),
                    0));
            var animate_id;
            var roting = function () {
                ++cnt;
                base_cuber.fixed_rot_by_mtrx(
                    base_cuber.cubes,
                    mtrx_rot);
                context.clearRect(
                    -640,
                    -360,
                    1280,
                    720);
                base_cuber.render(canvas);
                if (cnt === frm) {
                    t_cancel_animate(animate_id);
                    has_rot.y = 0;
                    var tmp = [];
                    for (var i = 0; i < 9; ++i) {
                        tmp[i] = base_cuber.front[i];
                    }

                    opposi_vtc(base_cuber.left);
                    op_clock(base_cuber.left);
                    base_cuber.front = base_cuber.left;

                    clock(base_cuber.back);
                    base_cuber.left = base_cuber.back;

                    opposi_vtc(base_cuber.right);
                    op_clock(base_cuber.right);
                    base_cuber.back = base_cuber.right;

                    clock(tmp);
                    base_cuber.right = tmp;

                    clock(base_cuber.down);
                    clock(base_cuber.up);

                    build_alpha_beta_gama();
                } else animate_id = t_request_animate(roting);
            };

            animate_id = t_request_animate(roting);
        };

    /**
     * a_up, down, left, right
     */
    this.auto_rot[26][0] = this.auto_rot[23][0] = this.auto_rot[20][0] =
        this.auto_rot[8][0] = this.auto_rot[5][0] = this.auto_rot[2][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.x) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.left,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[2];
                        tmp[1] = base_cuber.front[5];
                        tmp[2] = base_cuber.front[8];

                        base_cuber.front[2] = base_cuber.down[8];
                        base_cuber.front[5] = base_cuber.down[5];
                        base_cuber.front[8] = base_cuber.down[2];

                        base_cuber.down[8] = base_cuber.back[8];
                        base_cuber.down[5] = base_cuber.back[5];
                        base_cuber.down[2] = base_cuber.back[2];

                        base_cuber.back[8] = base_cuber.up[2];
                        base_cuber.back[5] = base_cuber.up[5];
                        base_cuber.back[2] = base_cuber.up[8];

                        base_cuber.up[2] = tmp[0];
                        base_cuber.up[5] = tmp[1];
                        base_cuber.up[8] = tmp[2];

                        op_clock(base_cuber.left);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting)
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[26][1] = this.auto_rot[23][1] = this.auto_rot[20][1] =
        this.auto_rot[8][1] = this.auto_rot[5][1] = this.auto_rot[2][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.x) / frm;
                var animate_id;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.left,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[2];
                        tmp[1] = base_cuber.front[5];
                        tmp[2] = base_cuber.front[8];

                        base_cuber.front[2] = base_cuber.up[2];
                        base_cuber.front[5] = base_cuber.up[5];
                        base_cuber.front[8] = base_cuber.up[8];

                        base_cuber.up[2] = base_cuber.back[8];
                        base_cuber.up[5] = base_cuber.back[5];
                        base_cuber.up[8] = base_cuber.back[2];

                        base_cuber.back[8] = base_cuber.down[8];
                        base_cuber.back[5] = base_cuber.down[5];
                        base_cuber.back[2] = base_cuber.down[2];

                        base_cuber.down[8] = tmp[0];
                        base_cuber.down[5] = tmp[1];
                        base_cuber.down[2] = tmp[2];

                        clock(base_cuber.left);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[17][2] = this.auto_rot[14][2] = this.auto_rot[11][2] =
        this.auto_rot[8][2] = this.auto_rot[7][2] = this.auto_rot[6][2] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.up,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[8];
                        tmp[1] = base_cuber.front[7];
                        tmp[2] = base_cuber.front[6];

                        base_cuber.front[8] = base_cuber.right[2];
                        base_cuber.front[7] = base_cuber.right[5];
                        base_cuber.front[6] = base_cuber.right[8];

                        base_cuber.right[2] = base_cuber.back[6];
                        base_cuber.right[5] = base_cuber.back[7];
                        base_cuber.right[8] = base_cuber.back[8];

                        base_cuber.back[6] = base_cuber.left[8];
                        base_cuber.back[7] = base_cuber.left[5];
                        base_cuber.back[8] = base_cuber.left[2];

                        base_cuber.left[8] = tmp[0];
                        base_cuber.left[5] = tmp[1];
                        base_cuber.left[2] = tmp[2];

                        op_clock(base_cuber.up);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[17][3] = this.auto_rot[14][3] = this.auto_rot[11][3] =
        this.auto_rot[8][3] = this.auto_rot[7][3] = this.auto_rot[6][3] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.up,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[8];
                        tmp[1] = base_cuber.front[7];
                        tmp[2] = base_cuber.front[6];

                        base_cuber.front[8] = base_cuber.left[8];
                        base_cuber.front[7] = base_cuber.left[5];
                        base_cuber.front[6] = base_cuber.left[2];

                        base_cuber.left[8] = base_cuber.back[6];
                        base_cuber.left[5] = base_cuber.back[7];
                        base_cuber.left[2] = base_cuber.back[8];

                        base_cuber.back[6] = base_cuber.right[2];
                        base_cuber.back[7] = base_cuber.right[5];
                        base_cuber.back[8] = base_cuber.right[8];

                        base_cuber.right[2] = tmp[0];
                        base_cuber.right[5] = tmp[1];
                        base_cuber.right[8] = tmp[2];

                        clock(base_cuber.up);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    /**
     * b_up, down, left, right
     */
    this.auto_rot[25][0] = this.auto_rot[22][0] = this.auto_rot[19][0] =
        this.auto_rot[7][0] = this.auto_rot[4][0] = this.auto_rot[1][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.x) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.alpha,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[1];
                        tmp[1] = base_cuber.front[4];
                        tmp[2] = base_cuber.front[7];

                        base_cuber.front[1] = base_cuber.down[7];
                        base_cuber.front[4] = base_cuber.down[4];
                        base_cuber.front[7] = base_cuber.down[1];

                        base_cuber.down[7] = base_cuber.back[7];
                        base_cuber.down[4] = base_cuber.back[4];
                        base_cuber.down[1] = base_cuber.back[1];

                        base_cuber.back[7] = base_cuber.up[1];
                        base_cuber.back[4] = base_cuber.up[4];
                        base_cuber.back[1] = base_cuber.up[7];

                        base_cuber.up[1] = tmp[0];
                        base_cuber.up[4] = tmp[1];
                        base_cuber.up[7] = tmp[2];

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[25][1] = this.auto_rot[22][1] = this.auto_rot[19][1] =
        this.auto_rot[7][1] = this.auto_rot[4][1] = this.auto_rot[1][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.x) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.alpha,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[1];
                        tmp[1] = base_cuber.front[4];
                        tmp[2] = base_cuber.front[7];

                        base_cuber.front[1] = base_cuber.up[1];
                        base_cuber.front[4] = base_cuber.up[4];
                        base_cuber.front[7] = base_cuber.up[7];

                        base_cuber.up[1] = base_cuber.back[7];
                        base_cuber.up[4] = base_cuber.back[4];
                        base_cuber.up[7] = base_cuber.back[1];

                        base_cuber.back[7] = base_cuber.down[7];
                        base_cuber.back[4] = base_cuber.down[4];
                        base_cuber.back[1] = base_cuber.down[1];

                        base_cuber.down[7] = tmp[0];
                        base_cuber.down[4] = tmp[1];
                        base_cuber.down[1] = tmp[2];

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[16][2] = this.auto_rot[13][2] = this.auto_rot[10][2] =
        this.auto_rot[5][2] = this.auto_rot[4][2] = this.auto_rot[3][2] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.beta,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[5];
                        tmp[1] = base_cuber.front[4];
                        tmp[2] = base_cuber.front[3];

                        base_cuber.front[5] = base_cuber.right[1];
                        base_cuber.front[4] = base_cuber.right[4];
                        base_cuber.front[3] = base_cuber.right[7];

                        base_cuber.right[1] = base_cuber.back[3];
                        base_cuber.right[4] = base_cuber.back[4];
                        base_cuber.right[7] = base_cuber.back[5];

                        base_cuber.back[3] = base_cuber.left[7];
                        base_cuber.back[4] = base_cuber.left[4];
                        base_cuber.back[5] = base_cuber.left[1];

                        base_cuber.left[7] = tmp[0];
                        base_cuber.left[4] = tmp[1];
                        base_cuber.left[1] = tmp[2];

                        op_clock(base_cuber.beta);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[16][3] = this.auto_rot[13][3] = this.auto_rot[10][3] =
        this.auto_rot[5][3] = this.auto_rot[4][3] = this.auto_rot[3][3] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.beta,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[5];
                        tmp[1] = base_cuber.front[4];
                        tmp[2] = base_cuber.front[3];

                        base_cuber.front[5] = base_cuber.left[7];
                        base_cuber.front[4] = base_cuber.left[4];
                        base_cuber.front[3] = base_cuber.left[1];

                        base_cuber.left[7] = base_cuber.back[3];
                        base_cuber.left[4] = base_cuber.back[4];
                        base_cuber.left[1] = base_cuber.back[5];

                        base_cuber.back[3] = base_cuber.right[1];
                        base_cuber.back[4] = base_cuber.right[4];
                        base_cuber.back[5] = base_cuber.right[7];

                        base_cuber.right[1] = tmp[0];
                        base_cuber.right[4] = tmp[1];
                        base_cuber.right[7] = tmp[2];

                        clock(base_cuber.beta);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    /**
     * c_up, down, left, right
     */
    this.auto_rot[24][0] = this.auto_rot[21][0] = this.auto_rot[18][0] =
        this.auto_rot[6][0] = this.auto_rot[3][0] = this.auto_rot[0][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.x) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.right,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[0];
                        tmp[1] = base_cuber.front[3];
                        tmp[2] = base_cuber.front[6];

                        base_cuber.front[0] = base_cuber.down[6];
                        base_cuber.front[3] = base_cuber.down[3];
                        base_cuber.front[6] = base_cuber.down[0];

                        base_cuber.down[6] = base_cuber.back[6];
                        base_cuber.down[3] = base_cuber.back[3];
                        base_cuber.down[0] = base_cuber.back[0];

                        base_cuber.back[6] = base_cuber.up[0];
                        base_cuber.back[3] = base_cuber.up[3];
                        base_cuber.back[0] = base_cuber.up[6];

                        base_cuber.up[0] = tmp[0];
                        base_cuber.up[3] = tmp[1];
                        base_cuber.up[6] = tmp[2];

                        op_clock(base_cuber.right);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[24][1] = this.auto_rot[21][1] = this.auto_rot[18][1] =
        this.auto_rot[6][1] = this.auto_rot[3][1] = this.auto_rot[0][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.x) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        t_deg_to_rad(remain),
                        0,
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.right,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.x = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.front[0];
                        tmp[1] = base_cuber.front[3];
                        tmp[2] = base_cuber.front[6];

                        base_cuber.front[0] = base_cuber.up[0];
                        base_cuber.front[3] = base_cuber.up[3];
                        base_cuber.front[6] = base_cuber.up[6];

                        base_cuber.up[0] = base_cuber.back[6];
                        base_cuber.up[3] = base_cuber.back[3];
                        base_cuber.up[6] = base_cuber.back[0];

                        base_cuber.back[6] = base_cuber.down[6];
                        base_cuber.back[3] = base_cuber.down[3];
                        base_cuber.back[0] = base_cuber.down[0];

                        base_cuber.down[6] = tmp[0];
                        base_cuber.down[3] = tmp[1];
                        base_cuber.down[0] = tmp[2];

                        clock(base_cuber.right);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[15][2] = this.auto_rot[12][2] = this.auto_rot[9][2] =
        this.auto_rot[2][2] = this.auto_rot[1][2] = this.auto_rot[0][2] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.down,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[2];
                        tmp[1] = base_cuber.front[1];
                        tmp[2] = base_cuber.front[0];

                        base_cuber.front[2] = base_cuber.right[0];
                        base_cuber.front[1] = base_cuber.right[3];
                        base_cuber.front[0] = base_cuber.right[6];

                        base_cuber.right[0] = base_cuber.back[0];
                        base_cuber.right[3] = base_cuber.back[1];
                        base_cuber.right[6] = base_cuber.back[2];

                        base_cuber.back[0] = base_cuber.left[6];
                        base_cuber.back[1] = base_cuber.left[3];
                        base_cuber.back[2] = base_cuber.left[0];

                        base_cuber.left[6] = tmp[0];
                        base_cuber.left[3] = tmp[1];
                        base_cuber.left[0] = tmp[2];

                        op_clock(base_cuber.down);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[15][3] = this.auto_rot[12][3] = this.auto_rot[9][3] =
        this.auto_rot[2][3] = this.auto_rot[1][3] = this.auto_rot[0][3] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.y) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        t_deg_to_rad(remain),
                        0));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.down,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        t_cancel_animate(animate_id);
                        has_rot.y = 0;
                        var tmp = [];
                        tmp[0] = base_cuber.front[2];
                        tmp[1] = base_cuber.front[1];
                        tmp[2] = base_cuber.front[0];

                        base_cuber.front[2] = base_cuber.left[6];
                        base_cuber.front[1] = base_cuber.left[3];
                        base_cuber.front[0] = base_cuber.left[0];

                        base_cuber.left[6] = base_cuber.back[0];
                        base_cuber.left[3] = base_cuber.back[1];
                        base_cuber.left[0] = base_cuber.back[2];

                        base_cuber.back[0] = base_cuber.right[0];
                        base_cuber.back[1] = base_cuber.right[3];
                        base_cuber.back[2] = base_cuber.right[6];

                        base_cuber.right[0] = tmp[0];
                        base_cuber.right[3] = tmp[1];
                        base_cuber.right[6] = tmp[2];

                        clock(base_cuber.down);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    /**
     * d_up, down
     */
    this.auto_rot[20][2] = this.auto_rot[19][2] = this.auto_rot[18][2] =
        this.auto_rot[11][0] = this.auto_rot[10][0] = this.auto_rot[9][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.front,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[0];
                        tmp[1] = base_cuber.right[1];
                        tmp[2] = base_cuber.right[2];

                        base_cuber.right[0] = base_cuber.down[2];
                        base_cuber.right[1] = base_cuber.down[1];
                        base_cuber.right[2] = base_cuber.down[0];

                        base_cuber.down[2] = base_cuber.left[2];
                        base_cuber.down[1] = base_cuber.left[1];
                        base_cuber.down[0] = base_cuber.left[0];

                        base_cuber.left[2] = base_cuber.up[0];
                        base_cuber.left[1] = base_cuber.up[1];
                        base_cuber.left[0] = base_cuber.up[2];

                        base_cuber.up[0] = tmp[0];
                        base_cuber.up[1] = tmp[1];
                        base_cuber.up[2] = tmp[2];

                        clock(base_cuber.front);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[20][3] = this.auto_rot[19][3] = this.auto_rot[18][3] =
        this.auto_rot[11][1] = this.auto_rot[10][1] = this.auto_rot[9][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.front,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[0];
                        tmp[1] = base_cuber.right[1];
                        tmp[2] = base_cuber.right[2];

                        base_cuber.right[0] = base_cuber.up[0];
                        base_cuber.right[1] = base_cuber.up[1];
                        base_cuber.right[2] = base_cuber.up[2];

                        base_cuber.up[0] = base_cuber.left[2];
                        base_cuber.up[1] = base_cuber.left[1];
                        base_cuber.up[2] = base_cuber.left[0];

                        base_cuber.left[2] = base_cuber.down[2];
                        base_cuber.left[1] = base_cuber.down[1];
                        base_cuber.left[0] = base_cuber.down[0];

                        base_cuber.down[2] = tmp[0];
                        base_cuber.down[1] = tmp[1];
                        base_cuber.down[0] = tmp[2];

                        op_clock(base_cuber.front);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    /**
     * e_up, down
     */
    this.auto_rot[23][2] = this.auto_rot[22][2] = this.auto_rot[21][2] =
        this.auto_rot[14][0] = this.auto_rot[13][0] = this.auto_rot[12][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.gama,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[3];
                        tmp[1] = base_cuber.right[4];
                        tmp[2] = base_cuber.right[5];

                        base_cuber.right[3] = base_cuber.down[5];
                        base_cuber.right[4] = base_cuber.down[4];
                        base_cuber.right[5] = base_cuber.down[3];

                        base_cuber.down[5] = base_cuber.left[5];
                        base_cuber.down[4] = base_cuber.left[4];
                        base_cuber.down[3] = base_cuber.left[3];

                        base_cuber.left[5] = base_cuber.up[3];
                        base_cuber.left[4] = base_cuber.up[4];
                        base_cuber.left[3] = base_cuber.up[5];

                        base_cuber.up[3] = tmp[0];
                        base_cuber.up[4] = tmp[1];
                        base_cuber.up[5] = tmp[2];

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[23][3] = this.auto_rot[22][3] = this.auto_rot[21][3] =
        this.auto_rot[14][1] = this.auto_rot[13][1] = this.auto_rot[12][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.gama,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[3];
                        tmp[1] = base_cuber.right[4];
                        tmp[2] = base_cuber.right[5];

                        base_cuber.right[3] = base_cuber.up[3];
                        base_cuber.right[4] = base_cuber.up[4];
                        base_cuber.right[5] = base_cuber.up[5];

                        base_cuber.up[3] = base_cuber.left[5];
                        base_cuber.up[4] = base_cuber.left[4];
                        base_cuber.up[5] = base_cuber.left[3];

                        base_cuber.left[5] = base_cuber.down[5];
                        base_cuber.left[4] = base_cuber.down[4];
                        base_cuber.left[3] = base_cuber.down[3];

                        base_cuber.down[5] = tmp[0];
                        base_cuber.down[4] = tmp[1];
                        base_cuber.down[3] = tmp[2];

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    /**
     * f_up
     */
    this.auto_rot[26][2] = this.auto_rot[25][2] = this.auto_rot[24][2] =
        this.auto_rot[17][0] = this.auto_rot[16][0] = this.auto_rot[15][0] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (-90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.back,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[6];
                        tmp[1] = base_cuber.right[7];
                        tmp[2] = base_cuber.right[8];

                        base_cuber.right[6] = base_cuber.down[8];
                        base_cuber.right[7] = base_cuber.down[7];
                        base_cuber.right[8] = base_cuber.down[6];

                        base_cuber.down[8] = base_cuber.left[8];
                        base_cuber.down[7] = base_cuber.left[7];
                        base_cuber.down[6] = base_cuber.left[6];

                        base_cuber.left[8] = base_cuber.up[6];
                        base_cuber.left[7] = base_cuber.up[7];
                        base_cuber.left[6] = base_cuber.up[8];

                        base_cuber.up[6] = tmp[0];
                        base_cuber.up[7] = tmp[1];
                        base_cuber.up[8] = tmp[2];

                        clock(base_cuber.back);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.auto_rot[26][3] = this.auto_rot[25][3] = this.auto_rot[24][3] =
        this.auto_rot[17][1] = this.auto_rot[16][1] = this.auto_rot[15][1] =
            function (canvas_id, quick) {
                var canvas = canvas_id, is_quick = quick || false;
                var context = document.getElementById(canvas).getContext("2d");
                var cnt = 0, frm = is_quick ? 1 : 10;
                var remain = (90 - has_rot.z) / frm;
                var mtrx_rot = t_get_rot_mtrx(
                    new t_point(
                        0,
                        0,
                        t_deg_to_rad(remain)));
                var animate_id;
                var roting = function () {
                    ++cnt;
                    base_cuber.fixed_rot_by_mtrx(
                        base_cuber.back,
                        mtrx_rot);
                    context.clearRect(
                        -640,
                        -360,
                        1280,
                        720);
                    base_cuber.render(canvas);
                    if (cnt === frm) {
                        has_rot.z = 0;
                        t_cancel_animate(animate_id);
                        var tmp = [];
                        tmp[0] = base_cuber.right[6];
                        tmp[1] = base_cuber.right[7];
                        tmp[2] = base_cuber.right[8];

                        base_cuber.right[6] = base_cuber.up[6];
                        base_cuber.right[7] = base_cuber.up[7];
                        base_cuber.right[8] = base_cuber.up[8];

                        base_cuber.up[6] = base_cuber.left[8];
                        base_cuber.up[7] = base_cuber.left[7];
                        base_cuber.up[8] = base_cuber.left[6];

                        base_cuber.left[8] = base_cuber.down[8];
                        base_cuber.left[7] = base_cuber.down[7];
                        base_cuber.left[6] = base_cuber.down[6];

                        base_cuber.down[8] = tmp[0];
                        base_cuber.down[7] = tmp[1];
                        base_cuber.down[6] = tmp[2];

                        op_clock(base_cuber.back);

                        build_alpha_beta_gama();
                    } else animate_id = t_request_animate(roting);
                };

                animate_id = t_request_animate(roting);
            };

    this.render = function (canvas_id) {
        base_cuber.render(canvas_id)
    }
};

var t_cuber = function (len,
                        render_canvas_id,
                        touch_canvas_id,
                        judge_canvas_id) {
    var render_canvas = document.getElementById(render_canvas_id);
    var touch_canvas = document.getElementById(touch_canvas_id);
    var render_context = render_canvas.getContext("2d");
    var touch_context = touch_canvas.getContext("2d");
    var touch_canvas_pos = new t_point(
        touch_canvas.getBoundingClientRect().left + 640,
        touch_canvas.getBoundingClientRect().top + 360);
    var judge_canvas = document.getElementById(judge_canvas_id);
    var judge_context = render_canvas.getContext("2d");


    var base_cuber_manager = new t_base_cuber_manager(len);
    var judge_base_cuber = new t_base_cuber(len);
    var current_pt = new t_point();
    var start_pt = new t_point();
    var is_click = false;
    var mouse_is_up = true;
    var move_time = 0;
    var direction = 0;

    var is_start = false;
    var answer = [];
    var is_rander = false;
    var is_win = false;

    var rander_cuber = function () {
        var rand_fps = 31;
        var rand_id;
        var randing = function () {
            --rand_fps;
            if (rand_fps === 0) {
                t_cancel_animate(rand_id);
            }
            else {
                answer[rand_fps - 1] = new t_point(
                    t_rand(29) - 1,
                    t_rand(4) - 1);
                base_cuber_manager.auto_rot[answer[rand_fps - 1].x][answer[rand_fps - 1].y](
                    render_canvas_id,
                    true);
                rand_id = t_request_animate(randing);
            }
        };
        rand_id = t_request_animate(randing);
    };

    var check_win = function () {
        var data = [];

        base_cuber_manager.render(judge_canvas_id);

        data[0] = judge_context.getImageData(640, 235, 1, 1).data;
        data[1] = judge_context.getImageData(640, 200, 1, 1).data;
        data[2] = judge_context.getImageData(640, 280, 1, 1).data;
        data[3] = judge_context.getImageData(700, 255, 1, 1).data;
        data[4] = judge_context.getImageData(700, 215, 1, 1).data;
        data[5] = judge_context.getImageData(780, 235, 1, 1).data;
        data[6] = judge_context.getImageData(565, 255, 1, 1).data;
        data[7] = judge_context.getImageData(585, 215, 1, 1).data;
        data[8] = judge_context.getImageData(515, 230, 1, 1).data;

        data[9] = judge_context.getImageData(475, 290, 1, 1).data;
        data[10] = judge_context.getImageData(480, 370, 1, 1).data;
        data[11] = judge_context.getImageData(486, 440, 1, 1).data;
        data[12] = judge_context.getImageData(530, 315, 1, 1).data;
        data[13] = judge_context.getImageData(530, 400, 1, 1).data;
        data[14] = judge_context.getImageData(530, 480, 1, 1).data;
        data[15] = judge_context.getImageData(585, 345, 1, 1).data;
        data[16] = judge_context.getImageData(585, 430, 1, 1).data;
        data[17] = judge_context.getImageData(585, 520, 1, 1).data;

        data[18] = judge_context.getImageData(665, 340, 1, 1).data;
        data[19] = judge_context.getImageData(665, 440, 1, 1).data;
        data[20] = judge_context.getImageData(665, 520, 1, 1).data;
        data[21] = judge_context.getImageData(740, 315, 1, 1).data;
        data[22] = judge_context.getImageData(740, 400, 1, 1).data;
        data[23] = judge_context.getImageData(740, 480, 1, 1).data;
        data[24] = judge_context.getImageData(800, 290, 1, 1).data;
        data[25] = judge_context.getImageData(800, 370, 1, 1).data;
        data[26] = judge_context.getImageData(800, 440, 1, 1).data;

        for (var i = 0; i < 8; ++i) {
            for (var j = 0; j < 4; ++j) {
                if (data[i][j] != data[i + 1][j]) return false;
                if (data[i + 9][j] != data[i + 10][j]) return false;
                if (data[i + 18][j] != data[i + 19][j]) return false;
            }
        }

        var delay_fps = 4;
        var delay_id;
        var delay = function () {
            --delay_fps;
            if (delay_fps === 3) {
                base_cuber_manager.auto_rot[28][1](judge_canvas_id, true);
            }
            if (delay_fps === 2) {
                base_cuber_manager.auto_rot[28][1](judge_canvas_id, true);
            }
            if (delay_fps === 1) {
                base_cuber_manager.auto_rot[27][2](judge_canvas_id, true);
            }
            if (delay_fps === 0) {
                t_cancel_animate(delay_id);
            }
            else delay_id = t_request_animate(delay);
        };
        delay_id = t_request_animate(delay);

        data[0] = judge_context.getImageData(640, 235, 1, 1).data;
        data[1] = judge_context.getImageData(640, 200, 1, 1).data;
        data[2] = judge_context.getImageData(640, 280, 1, 1).data;
        data[3] = judge_context.getImageData(700, 255, 1, 1).data;
        data[4] = judge_context.getImageData(700, 215, 1, 1).data;
        data[5] = judge_context.getImageData(780, 235, 1, 1).data;
        data[6] = judge_context.getImageData(565, 255, 1, 1).data;
        data[7] = judge_context.getImageData(585, 215, 1, 1).data;
        data[8] = judge_context.getImageData(515, 230, 1, 1).data;

        data[9] = judge_context.getImageData(475, 290, 1, 1).data;
        data[10] = judge_context.getImageData(480, 370, 1, 1).data;
        data[11] = judge_context.getImageData(486, 440, 1, 1).data;
        data[12] = judge_context.getImageData(530, 315, 1, 1).data;
        data[13] = judge_context.getImageData(530, 400, 1, 1).data;
        data[14] = judge_context.getImageData(530, 480, 1, 1).data;
        data[15] = judge_context.getImageData(585, 345, 1, 1).data;
        data[16] = judge_context.getImageData(585, 430, 1, 1).data;
        data[17] = judge_context.getImageData(585, 520, 1, 1).data;

        data[18] = judge_context.getImageData(665, 340, 1, 1).data;
        data[19] = judge_context.getImageData(665, 440, 1, 1).data;
        data[20] = judge_context.getImageData(665, 520, 1, 1).data;
        data[21] = judge_context.getImageData(740, 315, 1, 1).data;
        data[22] = judge_context.getImageData(740, 400, 1, 1).data;
        data[23] = judge_context.getImageData(740, 480, 1, 1).data;
        data[24] = judge_context.getImageData(800, 290, 1, 1).data;
        data[25] = judge_context.getImageData(800, 370, 1, 1).data;
        data[26] = judge_context.getImageData(800, 440, 1, 1).data;

        var e_delay_fps = 4;
        var e_delay_id;
        var e_delay = function () {
            --e_delay_fps;
            if (e_delay_fps === 3) {
                base_cuber_manager.auto_rot[27][3](judge_canvas_id, true);
            }
            if (e_delay_fps === 2) {
                base_cuber_manager.auto_rot[28][0](judge_canvas_id, true);
            }
            if (e_delay_fps === 1) {
                base_cuber_manager.auto_rot[28][0](judge_canvas_id, true);
            }
            if (e_delay_fps === 0) {
                t_cancel_animate(e_delay_id);
            }
            else e_delay_id = t_request_animate(e_delay);
        };
        e_delay_id = t_request_animate(e_delay);

        for (i = 0; i < 8; ++i) {
            for (j = 0; j < 4; ++j) {
                if (data[i][j] != data[i + 1][j]) return false;
                if (data[i + 9][j] != data[i + 10][j]) return false;
                if (data[i + 18][j] != data[i + 19][j]) return false;
            }
        }

        return true;
    };

    var get_direction = function (pt_vector) {
        var x_axis = t_get_vector_angle(
            pt_vector,
            new t_point(1, 0, 0));
        var anti_x_axis = t_get_vector_angle(
            pt_vector,
            new t_point(-1, 0, 0));
        var y_axis = t_get_vector_angle(
            pt_vector,
            new t_point(0, 1, 0));
        var anti_y_axis = t_get_vector_angle(
            pt_vector,
            new t_point(0, -1, 0));
        if (x_axis < 45.1) return 2;
        if (anti_x_axis < 45.1) return 3;
        if (y_axis < 45.1) return 0;
        if (anti_y_axis < 45.1) return 1;
    };

    var get_click_surface = function (pt_pos) {
        for (var i = 0; i < judge_base_cuber.front.length; ++i) {
            if (t_in_surface(pt_pos, judge_base_cuber.front[i].front)) {
                return i;
            }
        }
        for (var i = 0; i < judge_base_cuber.right.length; ++i) {
            if (t_in_surface(pt_pos, judge_base_cuber.right[i].left)) {
                return i + 9;
            }
        }
        for (var i = 0; i < judge_base_cuber.up.length; ++i) {
            if (t_in_surface(pt_pos, judge_base_cuber.up[i].up)) {
                return i + 18;
            }
        }
        if (pt_pos.x < 0) return 27;
        if (pt_pos.x > 0) return 28;
    };

    var cuber_on_mouse_down = function (e) {
        if (!is_start) {
            if (!is_rander) {
                touch_context.clearRect(-640, -360, 1280, 720);
                touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                touch_context.fillRect(-640, -360, 1280, 720);
                touch_context.font = "80px Georgia";
                touch_context.fillStyle = "#F3F3F3";
                touch_context.fillText("CUBER", -135, -190);
                touch_context.fillText("______", -150, -160);
                touch_context.fillStyle = "#202020";
                rander_cuber();
                is_rander = true;
                var delay_fps = 40;
                var delay_id;
                var delay = function () {
                    --delay_fps;
                    if (delay_fps === 0) {
                        t_cancel_animate(delay_id), is_start = true;
                        touch_context.clearRect(-640, -360, 1280, 720);
                    }
                    else delay_id = t_request_animate(delay);
                };
                delay_id = t_request_animate(delay);
            }
        } else if (!is_win) {
            start_pt.reset_point(
                e.pageX - touch_canvas_pos.x,
                e.pageY - touch_canvas_pos.y);
            if (mouse_is_up) is_click = true, mouse_is_up = false;
        } else if (is_win) {
            reset();
        }
    };

    var cuber_on_mouse_move = function (e) {
        if (is_click && !is_win) {
            ++move_time;
            if (move_time > 10) {
                current_pt.reset_point(
                    e.pageX - touch_canvas_pos.x,
                    e.pageY - touch_canvas_pos.y);
                if (move_time === 35) {
                    move_pt = t_pt_sub(
                        start_pt,
                        current_pt);
                    direction = get_direction(move_pt);
                    var click = get_click_surface(start_pt);
                    if (click > 26 && start_pt.y < 0) {
                        if (direction === 2) direction = 3;
                        else if (direction === 3) direction = 2;
                    }
                    console.log(click);
                    console.log(direction);
                    base_cuber_manager.auto_rot[click][direction](render_canvas_id);
                    var delay_fps = 30;
                    var delay_id;
                    var delay = function () {
                        --delay_fps;
                        if (delay_fps === 0) {
                            t_cancel_animate(delay_id), is_start = true;
                            if (check_win()) {
                                is_win = true;
                                touch_context.clearRect(-640, -360, 1280, 720);
                                touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                                touch_context.fillRect(-640, -360, 1280, 720);
                                touch_context.font = "80px Georgia";
                                touch_context.fillStyle = "#F3F3F3";
                                touch_context.fillText("WIN", -90, -190);
                                touch_context.fillText("______", -150, -160);
                                touch_context.font = "40px Georgia";
                                touch_context.fillText("TOUCH", -80, 0);
                                touch_context.fillText("CONTINUE", -115, 50);
                                touch_context.fillStyle = "#202020";
                            }
                        }
                        else delay_id = t_request_animate(delay);
                    };
                    delay_id = t_request_animate(delay);
                }
            }
        }
    };

    var cuber_on_mouse_up = function (e) {
        if (is_click && !is_win) {
            if (move_time > 10 && move_time < 35) {
                move_pt = t_pt_sub(
                    start_pt,
                    current_pt);
                direction = get_direction(move_pt);
                var click = get_click_surface(start_pt);
                if (click > 26 && start_pt.y < 0) {
                    if (direction === 2) direction = 3;
                    else if (direction === 3) direction = 2;
                }
                base_cuber_manager.auto_rot[click][direction](render_canvas_id);
                var e_delay_fps = 30;
                var e_delay_id;
                var e_delay = function () {
                    --e_delay_fps;
                    if (delay_fps === 0) {
                        t_cancel_animate(e_delay_id), is_start = true;
                        if (check_win()) {
                            is_win = true;
                            touch_context.clearRect(-640, -360, 1280, 720);
                            touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                            touch_context.fillRect(-640, -360, 1280, 720);
                            touch_context.font = "80px Georgia";
                            touch_context.fillStyle = "#F3F3F3";
                            touch_context.fillText("WIN", -90, -190);
                            touch_context.fillText("______", -150, -160);
                            touch_context.font = "40px Georgia";
                            touch_context.fillText("TOUCH", -80, 0);
                            touch_context.fillText("CONTINUE", -115, 50);
                            touch_context.fillStyle = "#202020";
                        }
                    }
                    else e_delay_id = t_request_animate(e_delay);
                };
                e_delay_id = t_request_animate(e_delay);
            }
            move_time = 0;
            var delay_fps = 11;
            var delay_id;
            var delay = function () {
                --delay_fps;
                if (delay_fps === 0) {
                    t_cancel_animate(delay_id), mouse_is_up = true, is_click = false;
                }
                else delay_id = t_request_animate(delay);
            };
            delay_id = t_request_animate(delay);
        }
    };

    var cuber_touch_start = function (e) {
        e.preventDefault();
        if (!is_start) {
            if (!is_rander) {
                touch_context.clearRect(-640, -360, 1280, 720);
                touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                touch_context.fillRect(-640, -360, 1280, 720);
                touch_context.font = "80px Georgia";
                touch_context.fillStyle = "#F3F3F3";
                touch_context.fillText("CUBER", -135, -190);
                touch_context.fillText("______", -150, -160);
                touch_context.fillStyle = "#202020";
                rander_cuber();
                is_rander = true;
                var delay_fps = 40;
                var delay_id;
                var delay = function () {
                    --delay_fps;
                    if (delay_fps === 0) {
                        t_cancel_animate(delay_id), is_start = true;
                        touch_context.clearRect(-640, -360, 1280, 720);
                    }
                    else delay_id = t_request_animate(delay);
                };
                delay_id = t_request_animate(delay);
            }
        } else if (!is_win) {
            start_pt.reset_point(
                e.changedTouches[0].pageX - touch_canvas_pos.x,
                e.changedTouches[0].pageY - touch_canvas_pos.y);
            if (mouse_is_up) is_click = true, mouse_is_up = false;
        } else if (is_win) {
            reset();
        }
    };

    var cuber_touch_end = function (e) {
        e.preventDefault();
        if (is_click && !is_win) {
            if (move_time > 3 && move_time < 16) {
                move_pt = t_pt_sub(
                    start_pt,
                    current_pt);
                direction = get_direction(move_pt);
                var click = get_click_surface(start_pt);
                if (click > 26 && start_pt.y < 0) {
                    if (direction === 2) direction = 3;
                    else if (direction === 3) direction = 2;
                }
                base_cuber_manager.auto_rot[click][direction](render_canvas_id);
                var e_delay_fps = 30;
                var e_delay_id;
                var e_delay = function () {
                    --e_delay_fps;
                    if (delay_fps === 0) {
                        t_cancel_animate(e_delay_id), is_start = true;
                        if (check_win()) {
                            is_win = true;
                            touch_context.clearRect(-640, -360, 1280, 720);
                            touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                            touch_context.fillRect(-640, -360, 1280, 720);
                            touch_context.font = "80px Georgia";
                            touch_context.fillStyle = "#F3F3F3";
                            touch_context.fillText("WIN", -90, -190);
                            touch_context.fillText("______", -150, -160);
                            touch_context.font = "40px Georgia";
                            touch_context.fillText("TOUCH", -80, 0);
                            touch_context.fillText("CONTINUE", -115, 50);
                            touch_context.fillStyle = "#202020";
                        }
                    }
                    else e_delay_id = t_request_animate(e_delay);
                };
                e_delay_id = t_request_animate(e_delay);
            }
            move_time = 0;
            var delay_fps = 11;
            var delay_id;
            var delay = function () {
                --delay_fps;
                if (delay_fps === 0) {
                    t_cancel_animate(delay_id), mouse_is_up = true, is_click = false;
                }
                else delay_id = t_request_animate(delay);
            };
            delay_id = t_request_animate(delay);
        }
    };

    var cuber_touch_move = function (e) {
        e.preventDefault();
        if (is_click && !is_win) {
            ++move_time;
            if (move_time > 3) {
                current_pt.reset_point(
                    e.changedTouches[0].pageX - touch_canvas_pos.x,
                    e.changedTouches[0].pageY - touch_canvas_pos.y);
                if (move_time === 16) {
                    move_pt = t_pt_sub(
                        start_pt,
                        current_pt);
                    direction = get_direction(move_pt);
                    var click = get_click_surface(start_pt);
                    if (click > 26 && start_pt.y < 0) {
                        if (direction === 2) direction = 3;
                        else if (direction === 3) direction = 2;
                    }
                    base_cuber_manager.auto_rot[click][direction](render_canvas_id);
                    var delay_fps = 30;
                    var delay_id;
                    var delay = function () {
                        --delay_fps;
                        if (delay_fps === 0) {
                            t_cancel_animate(delay_id), is_start = true;
                            if (check_win()) {
                                is_win = true;
                                touch_context.clearRect(-640, -360, 1280, 720);
                                touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
                                touch_context.fillRect(-640, -360, 1280, 720);
                                touch_context.font = "80px Georgia";
                                touch_context.fillStyle = "#F3F3F3";
                                touch_context.fillText("WIN", -90, -190);
                                touch_context.fillText("______", -150, -160);
                                touch_context.font = "40px Georgia";
                                touch_context.fillText("TOUCH", -80, 0);
                                touch_context.fillText("CONTINUE", -115, 50);
                                touch_context.fillStyle = "#202020";
                            }
                        }
                        else delay_id = t_request_animate(delay);
                    };
                    delay_id = t_request_animate(delay);
                }
            }
        }
    };

    var reset = function () {
        render_context.clearRect(-640, -360, 1280, 720);
        touch_context.clearRect(-640, -360, 1280, 720);

        base_cuber_manager = new t_base_cuber_manager(len);
        current_pt = new t_point();
        start_pt = new t_point();
        is_click = false;
        mouse_is_up = true;
        move_time = 0;
        direction = 0;

        is_start = false;
        answer = [];
        is_rander = false;
        is_win = false;

        base_cuber_manager.render(render_canvas_id);

        touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
        touch_context.fillRect(-640, -360, 1280, 720);
        touch_context.font = "80px Georgia";
        touch_context.fillStyle = "#F3F3F3";
        touch_context.fillText("CUBER", -135, -190);
        touch_context.fillText("______", -150, -160);
        touch_context.fillText("TOUCH", -145, 0);
        touch_context.fillText("START", -125, 85);
        touch_context.font = "30px Georgia";
        touch_context.fillText("________________", -150, 110);
        touch_context.fillText("Mobile Supported", -120, 160);
        touch_context.fillStyle = "#202020";
    };

    touch_canvas.addEventListener("mousedown", cuber_on_mouse_down, false);
    touch_canvas.addEventListener("mousemove", cuber_on_mouse_move, false);
    touch_canvas.addEventListener("mouseup", cuber_on_mouse_up, false);

    touch_canvas.addEventListener("touchstart", cuber_touch_start, false);
    touch_canvas.addEventListener("touchend", cuber_touch_end, false);
    touch_canvas.addEventListener("touchleave", cuber_touch_end, false);
    touch_canvas.addEventListener("touchcancel", cuber_touch_end, false);
    touch_canvas.addEventListener("touchmove", cuber_touch_move, false);

    for (var i = 0; i < judge_base_cuber.cubes.length; ++i) {
        judge_base_cuber.cubes[i].project_by_mtrx();
    }

    base_cuber_manager.render(render_canvas_id);

    touch_context.fillStyle = "rgba(32, 32, 32, 0.7)";
    touch_context.fillRect(-640, -360, 1280, 720);
    touch_context.font = "80px Georgia";
    touch_context.fillStyle = "#F3F3F3";
    touch_context.fillText("CUBER", -135, -190);
    touch_context.fillText("______", -150, -160);
    touch_context.fillText("TOUCH", -145, 0);
    touch_context.fillText("START", -125, 85);
    touch_context.font = "30px Georgia";
    touch_context.fillText("________________", -150, 110);
    touch_context.fillText("Mobile Supported", -120, 160);
    touch_context.fillStyle = "#202020";
};

var t_play_cuber = (function () {
    var render_canvas = document.getElementById("render");
    var render_context = render_canvas.getContext("2d");
    render_context.fillStyle = "#202020";
    render_context.strokeStyle = "#000";
    render_context.lineWidth = 1;
    render_context.fillRect(0, 0, 1280, 720);
    render_context.translate(640, 360);

    var touch_canvas = document.getElementById("touch");
    var touch_context = touch_canvas.getContext("2d");
    touch_context.fillStyle = "#202020";
    touch_context.translate(640, 360);
	
    var judge_canvas = document.getElementById("judge");
    var judge_context = judge_canvas.getContext("2d");
    judge_context.fillStyle = "#202020";
    judge_context.translate(-640, -360);

    var run = t_cuber(40, "render", "touch", "judge");
}());
